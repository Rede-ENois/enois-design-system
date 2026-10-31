import type { CommentsError } from "../domain/post/comments-error.js";
import type { PostSealLabelKey } from "../domain/post/post-seal-label-key.js";
import type { PostType } from "../domain/post/post-type.js";
import type { ReportTargetType } from "../domain/post/report-target-type.js";
import type { FormatPlaceholders } from "../lib/rich-text/format-placeholders.js";

export type PostMessages = {
  caughtUpDivider: { title: string; subline: string };
  spoilerText: { show: string; hide: string };
  imageLightbox: { title: string; close: string };
  mediaStage: { title: string; mute: string; unmute: string; close: string };
  liteVideo: { open: string };
  embedPlayer: {
    playerTitle: string;
    watchOn: (provider: string) => string;
    icons: { cinema: string; television: string; play: string };
  };
  linkPreviews: { openLabel: string; webIcon: string };
  inlineMedia: { spoilerReveal: string; openImage: string };
  mediaGrid: { spoilerReveal: string; openImage: string };
  richText: { spoilerReveal: string };
  postPage: { frameTitle: string; expand: string; dialogTitle: string; close: string };
  postOwnerMenu: { actions: string; edit: string; delete: string };
  authorInfo: {
    publishedIn: string;
    follow: string;
    sending: string;
    time: (time: string) => string;
  };
  postCard: {
    types: Record<PostType, string>;
    /** Status pill of a QUESTION post. */
    questionResolved: string;
    questionOpen: string;
    pinned: string;
    pin: string;
    unpin: string;
    topic: string;
    momentExpiry: (hours: number) => string;
    momentExpiryTitle: string;
    sealSeeWho: string;
    repostedWithOpinion: string;
    repostedFrom: (username: string | null | undefined) => string;
    quotedFrom: (username: string | null | undefined) => string;
    viewOriginal: string;
    readMore: string;
    readBlog: string;
    readArticle: string;
    edited: string;
    editedTime: (time: string) => string;
    mediaSpoilerReveal: string;
    pageLoading: string;
    tag: (tag: string) => string;
  };
  postEditDialog: {
    title: string;
    typeLabel: string;
    pageLabel: string;
    pagePlaceholder: string;
    bodyLabel: string;
    loading: string;
    cancel: string;
    save: string;
    saving: string;
  };
  postSeals: Record<PostSealLabelKey, string>;
  postSealPicker: { action: string; title: string; hint: string; remove: string };
  sealsDialog: {
    title: string;
    empty: string;
    error: string;
    loading: string;
    total: (count: number) => string;
  };
  postActions: {
    react: string;
    reactedWith: (emoji: string) => string;
    seeWho: (count: number) => string;
    comments: string;
    repost: string;
    repostUnavailable: string;
    share: string;
    report: string;
    save: string;
    unsave: string;
  };
  reactionsSummary: {
    reactWith: (emoji: string) => string;
    removeWith: (emoji: string) => string;
  };
  reactionsDialog: {
    title: string;
    emptyType: string;
    all: string;
    you: string;
    loadError: string;
    loading: string;
  };
  reportDialog: {
    titles: Record<ReportTargetType, string>;
    reason: string;
    /** Label per reason; a reason without a label shows its raw code. */
    reasons: Record<string, string>;
    description: string;
    action: string;
    sending: string;
    guidelines: string;
  };
  repostDialog: {
    title: string;
    description: string;
    opinionLabel: string;
    opinionPlaceholder: string;
    opinionCount: (length: number) => string;
    plain: string;
    withOpinion: string;
  };
  gifPickerDialog: {
    title: string;
    hint: string;
    placeholder: string;
    action: string;
    invalid: string;
    searchPlaceholder: string;
    trending: string;
    searchEmpty: (term: string) => string;
    searchNothing: string;
    searchError: string;
    unavailable: string;
    pasteToggle: string;
    backToSearch: string;
    poweredBy: (provider: string) => string;
    gif: string;
  };
  commentItem: {
    viewProfile: (name: string) => string;
    replyingTo: (name: string) => string;
    pinned: string;
    edited: string;
    save: string;
    saving: string;
    cancel: string;
    readMore: string;
    readLess: string;
    react: string;
    seeWho: (count: number) => string;
    reply: string;
    pin: string;
    unpin: string;
    edit: string;
    delete: string;
    report: string;
    accepted: string;
    accept: string;
    unaccept: string;
  };
  postComments: {
    errors: Record<CommentsError, string>;
    retry: string;
    empty: string;
    loadMore: string;
    loadingMore: string;
    replyingTo: (name: string) => string;
    reply: string;
    cancelReply: string;
    spoilerBadge: string;
    removeMedia: string;
    insertInText: string;
    mediaSpoiler: string;
    mediaSpoilerActive: string;
    attachMedia: string;
    recordAudio: string;
    stopRecording: string;
    recording: (minutes: number, seconds: number) => string;
    gif: string;
    send: string;
  };
  postNotes: {
    title: string;
    verified: string;
    add: string;
    dialogTitle: string;
    dialogDescription: string;
    warning: string;
    placeholder: string;
    send: string;
    sending: string;
    pending: string;
    denied: (reason: string) => string;
    discarded: string;
    count: (length: number, max: number) => string;
    time: (time: string) => string;
  };
  mentionTextarea: {
    toolbar: string;
    username: (username: string) => string;
    formatPlaceholders: FormatPlaceholders;
  };
  questionStatusFilter: {
    label: string;
    all: string;
    open: string;
    resolved: string;
  };
  questionComposer: { hint: string };
};
