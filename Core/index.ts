import { AssetType, Command, CommandCategory, Config, CreateData, CreateType, FrameInput as FrameInput, LoadCommand, RenderCommand, RenderCommandType, Vector2 } from './Ports';

export class Core {
    _test_label: Entity | null = null;
    _initial_assets: AssetList;
    constructor(public config: Config) {
        this._initial_assets = new AssetList(["https://pixijs.com/assets/bunny.png"])
    }


    MainLoop(frameInput: FrameInput): Command[] {
        let out: Command[] = []
        if (this._test_label == null) {
            this._test_label = new Entity(55)
            const createData = new CreateData(CreateType.TEXT, new Vector2(555, 150))
            createData.text = "Loading Bunny..."
            const command: RenderCommand = {
                CommandCategory: CommandCategory.RENDER,
                RenderCommandType: RenderCommandType.CREATE,
                ID: 55,
                CreateData: createData
            }
            out.push(command)
        }
        // Send command to load all initial assets, move to Loading
        this._initial_assets.UpdateLoadingToLoaded(frameInput.NewLoadedAssetIDs)
        while (this._initial_assets.Unloaded.length > 0) {
            const asset = this._initial_assets.Unloaded.pop();
            if (!asset) break;
            const command: LoadCommand = {
                CommandCategory: CommandCategory.LOAD,
                ID: "bunny",
                URLPath: asset,
                Type: AssetType.IMAGE
            }
            out.push(command)
            this._initial_assets.Loading.push(asset)
        }
        // 

        return out
    }
}

class Entity {
    _id: number;
    constructor(id: number) {
        this._id = id;
    }
}

class AssetList {
    Unloaded: string[];
    Loading: string[];
    Loaded: string[];
    constructor(unloadedList: string[]) {
        this.Unloaded = unloadedList;
        this.Loading = [];
        this.Loaded = [];
    }

    UpdateLoadingToLoaded(NewLoadedAssetIDs: string[] | undefined) {
        if (NewLoadedAssetIDs == undefined) {
            return
        }
        this.Loading = this.Loading.filter((id) => !NewLoadedAssetIDs.includes(id))
        for (const id of NewLoadedAssetIDs) {
            this.Loaded.push(id)
        }
    }
}

