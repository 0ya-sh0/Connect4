import { GameIO } from "./game_io";
import { GameModel } from "./game_model";
import { GameView } from "./game_view";
import { GameController } from "./game_controller";

const main = () => {
    let view: GameView =  new GameView();
    let controller: GameController = new GameController(view);
    let io: GameIO = new GameIO(controller);
    io.begin();
}

window.onload = main;