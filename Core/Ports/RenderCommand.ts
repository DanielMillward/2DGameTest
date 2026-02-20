export interface Command {
    CommandCategory: CommandCategory
}

export enum CommandCategory {
    RENDER,
    LOAD
}

export interface RenderCommand extends Command {
    RenderCommandType: RenderCommandType
    CreateData?: CreateData
    ID: number
}

export enum RenderCommandType {
    CREATE
}

export enum CreateType {
    TEXT
}

export class CreateData {
    type: CreateType;
    public text: string = "";
    location: Vector2;

    constructor(type: CreateType, location: Vector2) {
        this.type = type;
        this.location = location;
    }
}

export class Vector2 {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
