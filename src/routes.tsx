import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { ErrorView, HomeView, ReceiptsView } from './views';

export const Routes = () => (
    <Router>
        <Switch>
            <Route exact path="/">
                <HomeView />
            </Route>
            <Route path="/error">
                <ErrorView />
            </Route>
            <Route path="/receipts">
                <ReceiptsView />
            </Route>
        </Switch>
    </Router>
)
