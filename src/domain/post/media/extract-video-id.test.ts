import { describe, expect, it } from "vitest";

import { extractVideoId } from "./extract-video-id.js";

describe("extractVideoId", () => {
  it("reconhece as formas de link do YouTube (watch, curto, shorts, live)", () => {
    const id = "dQw4w9WgXcQ";
    const urls = [
      `https://www.youtube.com/watch?v=${id}`,
      `https://m.youtube.com/watch?v=${id}&list=RD${id}&start_radio=1`,
      `https://www.youtube.com/watch?feature=share&v=${id}`,
      `https://youtu.be/${id}?si=abc`,
      `https://youtube.com/shorts/${id}?si=abc`,
      `https://www.youtube.com/live/${id}`,
      `https://www.youtube.com/embed/${id}`,
      `https://www.youtube-nocookie.com/embed/${id}`,
    ];

    for (const url of urls) {
      expect(extractVideoId(url), url).toEqual({ type: "youtube", id });
    }
  });

  it("não transforma página comum em player", () => {
    expect(extractVideoId("https://exemplo.com/noticia")).toBeNull();
    expect(extractVideoId("https://www.youtube.com/@canal")).toBeNull();
  });

  it("guarda o tipo do Spotify no id (o embed precisa de track/album/playlist)", () => {
    expect(extractVideoId("https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC")).toEqual({
      type: "spotify",
      id: "track/4uLU6hMCjMI75M1A2tKUQC",
    });
    expect(
      extractVideoId("https://open.spotify.com/intl-pt/album/4uLU6hMCjMI75M1A2tKUQC?si=1"),
    ).toEqual({ type: "spotify", id: "album/4uLU6hMCjMI75M1A2tKUQC" });
  });

  it("lê o momento compartilhado do link do YouTube (o player começa no tempo marcado)", () => {
    const id = "maKziwtT-Es";
    expect(extractVideoId(`https://youtu.be/${id}?t=6479`)).toEqual({
      type: "youtube",
      id,
      startSeconds: 6479,
    });
    expect(extractVideoId(`https://youtu.be/${id}?si=abc&t=6479`)).toEqual({
      type: "youtube",
      id,
      startSeconds: 6479,
    });
    expect(extractVideoId(`https://www.youtube.com/watch?v=${id}&t=10m5s`)).toEqual({
      type: "youtube",
      id,
      startSeconds: 605,
    });
    expect(extractVideoId(`https://www.youtube.com/watch?v=${id}&t=1h2m3s`)).toEqual({
      type: "youtube",
      id,
      startSeconds: 3723,
    });
    expect(extractVideoId(`https://www.youtube.com/watch?v=${id}&start=90`)).toEqual({
      type: "youtube",
      id,
      startSeconds: 90,
    });
  });

  it("não inventa começo: sem tempo, com tempo zero ou parâmetro parecido", () => {
    const id = "dQw4w9WgXcQ";
    expect(extractVideoId(`https://youtu.be/${id}?si=abc`)).toEqual({ type: "youtube", id });
    expect(extractVideoId(`https://youtu.be/${id}?t=0`)).toEqual({ type: "youtube", id });
    // `start_radio` é playlist, não momento: não pode virar `start`.
    expect(
      extractVideoId(`https://m.youtube.com/watch?v=${id}&list=RD${id}&start_radio=1`),
    ).toEqual({ type: "youtube", id });
  });
});
