import * as mqtt from "mqtt";
import { ref } from "vue";

export function useMqtt() {
  const client = ref(null);
  const url = process.env.mqttURL;
  const connect = () => {
    client.value = mqtt.connect(url);

    return new Promise((resolve, reject) => {
      client.value.on("connect", () => {
        resolve();
      });

      client.value.on("error", (err) => {
        reject(err);
      });
    });
  };

  const _topicHandlers = new Map();

  const subscribe = (topic, callback) => {
    if (client.value) {
      client.value.subscribe(topic);
      const handler = (receivedTopic, message) => {
        if (receivedTopic === topic) {
          callback(message.toString());
        }
      };
      _topicHandlers.set(topic, handler);
      client.value.on("message", handler);
    }
  };

  const unSubscribe = (topic) => {
    if (client.value) {
      client.value.unsubscribe(topic, (error) => {
        if (error) {
          console.log("Unsubscribe error", error);
        }
      });
      const handler = _topicHandlers.get(topic);
      if (handler) {
        client.value.removeListener("message", handler);
        _topicHandlers.delete(topic);
      }
    }
  };

  const disconnect = () => {
    if (client.value) {
      client.value.end();
    }
  };

  return {
    client,
    connect,
    subscribe,
    unSubscribe,
    disconnect,
  };
}
