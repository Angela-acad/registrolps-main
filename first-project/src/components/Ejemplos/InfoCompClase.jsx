import React from "react";

class InfoCompClase extends React.Component {
    render() {
        return <h1>Información básica sobre componentes de {this.props.tipo}</h1>;
    }
}

export default InfoCompClase;