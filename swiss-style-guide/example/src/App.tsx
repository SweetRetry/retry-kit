import { Route, Switch } from "wouter";
import { SwissLayout } from "./layout/SwissLayout";
import Manifesto from "./pages/Manifesto";
import Foundations from "./pages/Foundations";
import Typography from "./pages/Typography";
import Components from "./pages/Components";

function App() {
  return (
    <SwissLayout>
      <Switch>
        <Route path="/" component={Manifesto} />
        <Route path="/foundations" component={Foundations} />
        <Route path="/typography" component={Typography} />
        <Route path="/components" component={Components} />
        {/* Fallback */}
        <Route>
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h1 className="text-9xl font-bold mb-4">404</h1>
              <p className="text-muted-foreground font-mono">
                OBJECT_NOT_FOUND
              </p>
            </div>
          </div>
        </Route>
      </Switch>
    </SwissLayout>
  );
}

export default App;
