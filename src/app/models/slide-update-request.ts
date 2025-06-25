export interface SlideUpdateRequest {
  slideIndex: number;
  newContent: string;
}

export interface SlideUpdateRequestPatch {
  newContent: string;
}
