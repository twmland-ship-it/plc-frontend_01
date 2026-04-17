import { ref } from 'vue'
import { useStore } from 'vuex'

function safeEvalCondition (value, condition) {
  if (!condition) return false
  const num = Number(value)
  const m = condition.match(/^([><=!]+)\s*(.+)$/)
  if (!m) return false
  const op = m[1]
  const rhs = Number(m[2])
  if (isNaN(rhs)) return false
  const v = isNaN(num) ? value : num
  switch (op) {
    case '>': return v > rhs
    case '>=': return v >= rhs
    case '<': return v < rhs
    case '<=': return v <= rhs
    case '==': case '===': return v === rhs
    case '!=': case '!==': return v !== rhs
    default: return false
  }
}

export function useUpdate () {
  const { dispatch, state } = useStore()

  const _lastTagValues = new Map()

  const updateAllTag = (sources, allTags, _isRecursive = false) => {
    const sourceMap = _isRecursive ? sources : new Map(sources.map(s => [s.TagId, s]))
    const lookup = sourceMap instanceof Map ? sourceMap : sources

    allTags.forEach(el => {
      if (el._objects) {
        updateAllTag(lookup, el.getObjects(), true)
        return
      }
      const tar = lookup instanceof Map ? lookup.get(el.tagId) : sources.find(s => s.TagId === el.tagId)

      if (tar && tar.TagRealvalue && !el.showProperty) {
        const cacheKey = el.tagId || ''
        const prev = _lastTagValues.get(cacheKey)
        if (prev && prev.value === tar.TagRealvalue && prev.alarm === tar.AlarmState && prev.priority === tar.AlarmPriority) {
          return
        }
        _lastTagValues.set(cacheKey, { value: tar.TagRealvalue, alarm: tar.AlarmState, priority: tar.AlarmPriority })

        el.set({ text: tar.TagRealvalue })

        const rules = el.rule
        if (!rules) {
          if (el.stroke !== el.normalStroke || el.fill !== el.normalFill) {
            el.set({ stroke: el.normalStroke, fill: el.normalFill })
          }
          return
        }

        const isStop = safeEvalCondition(tar.TagRealvalue, rules.stopValue)

        if (isStop) {
          if (rules.stopAction === '1' && rules.stopValue) {
            el.visible = false
          } else if (rules?.stopAction === '2' && !rules.stopValue) {
            el.set({ stroke: rules.stopStroke, fill: rules.stopFill })
          }
        } else if (rules.stopAction === '1') {
          el.visible = true
          if (el.stroke !== el.normalStroke || el.fill !== el.normalFill) {
            el.set({ stroke: el.normalStroke, fill: el.normalFill })
          }
        } else if (
          tar.AlarmState &&
          tar.AlarmState !== 3 &&
          tar.AlarmState !== 4
        ) {
          const alarmRes = checkAlarmStyle({
            rules,
            type: tar.TagType,
            state: tar.AlarmState,
            priority: tar.AlarmPriority
          })
          if (alarmRes) {
            el.set({ stroke: alarmRes.stroke, fill: alarmRes.fill })
          }
        } else {
          if (el.stroke !== el.normalStroke || el.fill !== el.normalFill) {
            el.set({ stroke: el.normalStroke, fill: el.normalFill })
          }
        }
      } else {
        if (el.stroke !== el.normalStroke || el.fill !== el.normalFill) {
          el.set({ stroke: el.normalStroke, fill: el.normalFill })
        }
      }
    })
  }

  function checkAlarmStyle ({ rules, type, state, priority }) {
    if (type === 1) {
      // analogy
      if (state === 1) {
        // alarm
        if (rules.HHAlarmStatus && priority === 3) {
          return {
            stroke: rules.HHAlarmStroke,
            fill: rules.HHAlarmFill
          }
        } else if (rules.HIAlarmStatus && priority === 2) {
          return {
            stroke: rules.HIAlarmStroke,
            fill: rules.HIAlarmFill
          }
        } else if (rules.LLAlarmStatus && priority === 1) {
          return {
            stroke: rules.LLAlarmStroke,
            fill: rules.LLAlarmFill
          }
        } else if (rules.LOAlarmStatus && priority === 0) {
          return {
            stroke: rules.LOAlarmStroke,
            fill: rules.LOAlarmFill
          }
        }
      } else if (state === 2) {
        // check
        if (rules.HHCheckStatus && priority === 3) {
          return {
            stroke: rules.HHCheckStroke,
            fill: rules.HHCheckFill
          }
        } else if (rules.HICheckStatus && priority === 2) {
          return {
            stroke: rules.HICheckStroke,
            fill: rules.HICheckFill
          }
        } else if (rules.LLCheckStatus && priority === 1) {
          return {
            stroke: rules.LLCheckStroke,
            fill: rules.LLCheckFill
          }
        } else if (rules.LOCheckStatus && priority === 0) {
          return {
            stroke: rules.LOCheckStroke,
            fill: rules.LOCheckFill
          }
        }
      }
    } else if (type === 0) {
      // digital
      if (state === 1) {
        // alarm
        if (rules.digAlarmStatus && priority === 1) {
          return {
            stroke: rules.digAlarmStroke,
            fill: rules.digAlarmFill
          }
        }
      } else if (state === 2) {
        // check
        if (rules.digCheckStatus && priority === 1) {
          return {
            stroke: rules.digCheckStroke,
            fill: rules.digCheckFill
          }
        }
      }
    }
    return
  }

  const setNormalStyle = object => {
    if (object._objects) {
      object._objects.forEach(el => {
        setNormalStyle(el)
      })
    } else {
      object.set('normalStroke', object.stroke)
      object.set('normalFill', object.fill)
    }
  }

  const showPropsData = ref()
  const getAllPropTags = async canvasJSON => {
    const allTags = []
    for (let i = 0; i < canvasJSON.objects.length; i++) {
      if (canvasJSON.objects[i].showProperty) {
        allTags.push(canvasJSON.objects[i].tagId)
      }
    }
    if (allTags.length > 0) {
      const res = await dispatch('tags/fetchAdditionProps', allTags)
      showPropsData.value = res
    }
  }

  const setCanvasString = async symbolList => {
    if (state.gui.guiDetail.DataContentJson) {
      let contentRaw = state.gui.guiDetail.DataContentJson
      try {
        if (typeof contentRaw === 'string') {
          contentRaw = JSON.parse(contentRaw)
        }
        // 有些版本會存成「字串包字串」，第二層再解一次
        if (typeof contentRaw === 'string') {
          contentRaw = JSON.parse(contentRaw)
        }
      } catch (err) {
        console.warn('[GUI] setCanvasString parse failed:', err?.message || err)
        return {}
      }
      const content = contentRaw

      await getAllPropTags(content)
      const callback = (obj, symbolVars) => {
        if (obj.objects) {
          obj.objects.forEach(el => {
            callback(el, symbolVars)
          })
        } else {
          if (obj.symbolVar) {
            obj.tagId = symbolVars.find(el => el.name === obj.symbolVar).value
          }
        }
      }
      for (let i = 0; i < content.objects.length; i++) {
        if (content.objects[i].symbolId) {
          const symbolData = symbolList.find(
            symbol => symbol.id === content.objects[i].symbolId
          )
          if (symbolData) {
            const symbolContent = JSON.parse(symbolData.content)
            const props = {
              ...content.objects[i],
              objects: symbolContent.objects,
              width: symbolContent.width,
              height: symbolContent.height,
              symbolVars: symbolData.allSymbolVars.map(el => {
                const hasValue = content.objects[i].symbolVars.find(
                  symbolVar => symbolVar.name === el
                )
                if (hasValue) {
                  return { name: el, value: hasValue.value }
                } else {
                  return { name: el, value: null }
                }
              })
            }
            callback(props, props.symbolVars)
            content.objects[i] = props
          }
        }
      }  
      return content
    } else {
      return {}
    }
  }

  const setAdditionProperty = object => {
    if (object._objects) {
      object._objects.forEach(el => {
        setAdditionProperty(el)
      })
    } else {
      if (object.showProperty) {
        const tar = showPropsData.value[object.tagId]
        if (tar) {
          object.set({ text: tar[object.showProperty] || '屬性未設定' })
        }
      }
    }
  }

  return {
    updateAllTag,
    setNormalStyle,
    setCanvasString,
    getAllPropTags,
    setAdditionProperty
  }
}
