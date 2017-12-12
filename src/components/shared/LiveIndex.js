import React, { Component } from "react";

export class LiveIndex extends React.Component {
    constructor() {
        super()
        this.state = {
            response: false,
            endpoint: "http://127.0.0.1:4001"
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.data !== nextProps.data) {

            clearTimeout(this.timeout);

            // Optionally do something with data

            if (!nextProps.isFetching) {
                this.startPoll();
            }
        }


    }

    componentWillMount() {
        this.props.dataActions.dataFetch();
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    startPoll() {
        this.timeout = setTimeout(() => this.props.dataActions.dataFetch(), 15000);
    }
}    