import { Command } from './RenderCommand'

export interface LoadCommand extends Command {
    ID: string
    URLPath: string
    Type: AssetType
}

export enum AssetType {
    IMAGE
}