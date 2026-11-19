// @vitest-environment jsdom
import { StrictMode, act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PostComments } from "./post-comments.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

class Recorder {
  static current: Recorder | null = null;

  state: RecordingState = "inactive";
  mimeType = "audio/webm";
  ondataavailable: ((event: { data: Blob }) => void) | null = null;
  onstop: (() => void) | null = null;

  constructor(readonly stream: MediaStream) {
    Recorder.current = this;
  }

  start = vi.fn(() => {
    this.state = "recording";
  });

  stop = vi.fn(() => {
    this.state = "inactive";
  });
}

afterEach(() => {
  act(() => root.render(null));
  Recorder.current = null;
  vi.unstubAllGlobals();
});

const microphone = () => {
  const stop = vi.fn();
  const stream = { getTracks: () => [{ stop }] } as unknown as MediaStream;
  return { stream, stop };
};

const mockMicrophone = (getUserMedia: () => Promise<MediaStream>) => {
  vi.stubGlobal("MediaRecorder", Recorder);
  vi.stubGlobal("navigator", { ...navigator, mediaDevices: { getUserMedia } });
};

const render = (onAddAudio = vi.fn()) =>
  act(() =>
    root.render(
      <StrictMode>
        <PostComments
          formId="comments"
          comments={[]}
          loading={false}
          loadingMore={false}
          hasMore={false}
          error={null}
          onRetry={() => undefined}
          onLoadMore={() => undefined}
          renderComment={() => null}
          replyToId={null}
          onCancelReply={() => undefined}
          media={[]}
          mediaSpoiler={false}
          onToggleMediaSpoiler={() => undefined}
          onRemoveMedia={() => undefined}
          onInsertMedia={() => undefined}
          onAddImages={() => undefined}
          onAddAudio={onAddAudio}
          onErrorChange={() => undefined}
          composerField={<textarea />}
          canSend={false}
          sending={false}
          onSubmit={async () => true}
          onOpenGifPicker={() => undefined}
        />
      </StrictMode>,
    ),
  );

const openTools = () =>
  act(() => container.querySelector<HTMLButtonElement>("button[aria-controls]")!.click());

const audioButton = () =>
  container.querySelector<HTMLButtonElement>('button[aria-label="Gravar áudio"]')!;

const stopButton = () =>
  container.querySelector<HTMLButtonElement>('button[aria-label="Parar a gravação"]')!;

describe("PostComments recording", () => {
  it("stops the recorder and microphone on unmount without delivering audio", async () => {
    const { stream, stop } = microphone();
    mockMicrophone(vi.fn().mockResolvedValue(stream));
    const onAddAudio = vi.fn();
    render(onAddAudio);
    openTools();

    await act(async () => audioButton().click());
    const recorder = Recorder.current!;
    recorder.ondataavailable?.({ data: new Blob(["audio"]) });

    act(() => root.render(null));
    expect(recorder.stop).toHaveBeenCalledOnce();
    expect(stop).toHaveBeenCalledOnce();
    act(() => recorder.onstop?.());
    expect(onAddAudio).not.toHaveBeenCalled();
    expect(recorder.ondataavailable).toBeNull();
    expect(recorder.onstop).toBeNull();
  });

  it("releases permission granted after unmount without creating a recorder", async () => {
    const { stream, stop } = microphone();
    let resolveStream!: (value: MediaStream) => void;
    mockMicrophone(
      () =>
        new Promise<MediaStream>((resolve) => {
          resolveStream = resolve;
        }),
    );
    render();
    openTools();

    act(() => audioButton().click());
    act(() => root.render(null));
    await act(async () => resolveStream(stream));

    expect(stop).toHaveBeenCalledOnce();
    expect(Recorder.current).toBeNull();
  });

  it("delivers audio when recording stops while mounted", async () => {
    const { stream, stop } = microphone();
    mockMicrophone(vi.fn().mockResolvedValue(stream));
    const onAddAudio = vi.fn();
    render(onAddAudio);
    openTools();

    await act(async () => audioButton().click());
    const recorder = Recorder.current!;
    recorder.ondataavailable?.({ data: new Blob(["audio"]) });
    act(() => stopButton().click());
    expect(onAddAudio).not.toHaveBeenCalled();

    act(() => recorder.onstop?.());
    expect(stop).toHaveBeenCalledOnce();
    expect(onAddAudio).toHaveBeenCalledExactlyOnceWith(expect.any(File));
  });
});
