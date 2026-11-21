import { describe, expect, it } from "vitest";

import { groupTopicErrorFromServer } from "./topic-error-code.js";

describe("groupTopicErrorFromServer", () => {
  it("maps the server codes to the topic errors", () => {
    expect(groupTopicErrorFromServer("TOPIC_EXISTS")).toBe("ALREADY_EXISTS");
    expect(groupTopicErrorFromServer("INVALID_TOPIC_NAME")).toBe("INVALID_NAME");
    expect(groupTopicErrorFromServer("TOO_MANY_TOPICS")).toBe("TOO_MANY");
    expect(groupTopicErrorFromServer("NOT_MANAGER")).toBe("FORBIDDEN");
    expect(groupTopicErrorFromServer("FORBIDDEN")).toBe("FORBIDDEN");
  });

  it("treats a topic that vanished or is archived as a bad name", () => {
    expect(groupTopicErrorFromServer("TOPIC_NOT_FOUND")).toBe("INVALID_NAME");
    expect(groupTopicErrorFromServer("TOPIC_ARCHIVED")).toBe("INVALID_NAME");
  });

  it("returns null for no code or an unknown one", () => {
    expect(groupTopicErrorFromServer(null)).toBeNull();
    expect(groupTopicErrorFromServer(undefined)).toBeNull();
    expect(groupTopicErrorFromServer("SOMETHING_NEW")).toBeNull();
  });
});
