<template>
  <ModalStyled
    :title="title"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="onOk"
    @cancel="onCancel"
    :afterClose="handleAfterClose"
    :type="color ? this.type : false"
    :width="width"
    :class="className"
    :wrapClassName="wrapClassName"
    :rootClassName="rootClassName"
    :footer="null"
    :maskClosable="maskClosable"
  >
    <template #footer>
      <slot name="footer">
        <sdButton
          type="white"
          :outlined="color ? false : true"
          key="back"
          @click="onCancel"
        >
          Return
        </sdButton>
        <sdButton
          key="submit"
          :type="color ? 'white' : type"
          :outlined="type !== 'white' ? false : true"
          :loading="confirmLoading"
          @click="handleOk"
        >
          Submit
        </sdButton>
      </slot>
    </template>

    <slot name="title"> </slot>

    <slot></slot>
  </ModalStyled>
</template>

<script>
import { ModalStyled } from "./styled";
import VueTypes from "vue-types";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Modal",
  components: {
    ModalStyled,
  },
  props: {
    onCancel: VueTypes.func,
    onOk: VueTypes.func,
    visible: VueTypes.bool.def(false),
    confirmLoading: VueTypes.bool.def(false),
    title: VueTypes.string,
    class: VueTypes.string.def("ninjadash-modal"),
    wrapClassName: VueTypes.string,
    rootClassName: VueTypes.string,
    type: VueTypes.oneOf([
      "primary",
      "secondary",
      "success",
      "error",
      "danger",
      "info",
      "white",
      "warning",
    ]).def("white"),
    footer: VueTypes.oneOf([null]),
    width: VueTypes.number.def(620),
    color: VueTypes.oneOfType([VueTypes.bool, VueTypes.string]).def(false),
    maskClosable: VueTypes.bool.def(false),
  },
  data() {
    return {
      className: this.class,
      previouslyFocusedElement: null,
    };
  },
  watch: {
    visible(nextVisible) {
      if (nextVisible) {
        this.previouslyFocusedElement = document.activeElement;
        return;
      }

    },
  },
  methods: {
    handleAfterClose() {
    },
  },
});
</script>
