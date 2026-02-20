import { Core } from '../Core'
import { Application, Graphics, Renderer, Text, Assets } from 'pixi.js';
import { CommandCategory, CreateData, LoadCommand, RenderCommand, RenderCommandType } from '../Core/Ports';

async function main() {
    const core: Core = new Core({});
    const app = new Application();
    let newlyLoaded: Record<string, any> = {}
    let Loaded: Record<string, any> = {}
    await initApp(app);

    requestAnimationFrame((now) => loop(app, core, newlyLoaded, Loaded, now));
}

function loop(app: Application<Renderer>, core: Core, newlyLoaded: Record<string, any>, Loaded: Record<string, any>, now = performance.now()) {
    const commands = core.MainLoop({
        WindowSize: {
            Width: app.renderer.width,
            Height: app.renderer.height
        },
        NewLoadedAssetIDs: updateLoadingAssets(newlyLoaded, Loaded)
    })

    for (const command of commands) {
        switch (command.CommandCategory) {
            case CommandCategory.RENDER:
                handleRenderCommand(app, command as RenderCommand);
                break;
            case CommandCategory.LOAD:
                handleLoadCommand(app, newlyLoaded, command as LoadCommand);
                break;
            default:
                break;
        }
    }

    app.renderer.render(app.stage);
    requestAnimationFrame((nextNow) => loop(app, core, newlyLoaded, Loaded, nextNow));
}


async function initApp(app: Application<Renderer>) {
    await app.init({
        resizeTo: window,
        background: '#1f2937'
    });
    document.body.appendChild(app.canvas);

    app.ticker.stop();


}

function addSprite(app: Application<Renderer>, command: CreateData) {
    //const box = new Graphics().rect(320, 240, 160, 120).fill(0x4ade80);
    const label = new Text({
        text: command.text,
        style: {
            fill: 0xffffff,
            fontSize: 28
        }
    });

    label.x = command.location.x;
    label.y = command.location.y;

    //app.stage.addChild(box);
    app.stage.addChild(label);
}

function handleRenderCommand(app: Application<Renderer>, command: RenderCommand) {
    switch (command.RenderCommandType) {
        case RenderCommandType.CREATE:
            addSprite(app, command.CreateData!);
            break;

        default:
            break;
    }
}

function handleLoadCommand(app: Application<Renderer>, newlyLoaded: Record<string, any>, command: LoadCommand) {
    let result = Assets.load(command.URLPath).then((asset) => {
        newlyLoaded[command.ID] = asset;
        return asset;
    })
}

function updateLoadingAssets(newlyLoaded: Record<string, any>, Loaded: Record<string, any>): string[] {
    let out: string[] = []
    for (const key in newlyLoaded) {
        Loaded[key] = newlyLoaded[key];
        delete newlyLoaded[key];
        out.push(key)
    }
    return out
}

void main();


