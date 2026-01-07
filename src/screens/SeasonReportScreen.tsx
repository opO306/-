import { View, Text, Pressable } from "react-native";

export function SeasonReportScreen({ text, onClose }) {
  return (
    <View style={{ flex: 1, padding: 28, justifyContent: "center" }}>
      <Text style={{
        fontSize: 15,
        lineHeight: 26,
        color: "#111",
        marginBottom: 40
      }}>
        {text}
      </Text>

      <Pressable onPress={onClose} style={{ alignSelf: "center" }}>
        <Text style={{ fontSize: 14, color: "#666" }}>계속</Text>
      </Pressable>
    </View>
  );
}
