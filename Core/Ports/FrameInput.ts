export interface FrameInput {
    WindowSize: WindowSize | null;
    NewLoadedAssetIDs?: string[];
    // Player Input here
}

export interface WindowSize {
    Width: number;
    Height: number;
}
