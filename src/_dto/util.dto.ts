export interface UrlMatchGroups {
  entryId?: string;
  commentId?: string;
}

export interface ParsedFetchResponse {
  status: number;
  ok: boolean;
  json: any;
}
