import React from "react";
// import PropTypes from "prop-types";
import API from "../../api/api";
import Board from "../board/board";

const SERVER_URL = `//68f02c80-3bed-4e10-a747-4ff774ae905a.pub.instances.scw.cloud`;
// const SERVER_URL = `http://localhost:13337`;
const api = new API(SERVER_URL);

const newCells = api.getNewCellsForGameLevel(2);

const App = () => {
    return (
        <Board cells={newCells}/>
    )
}

export default App;