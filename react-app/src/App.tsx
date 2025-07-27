import Message from "./practice/Message";
import ListGroup from "./practice/ListGroup";
function App() {
  let items = ["New York", "Los Angeles", "Chicago"];

  return (
    <div>
      <Message></Message>
      <ListGroup items={items} heading="Cities"></ListGroup>
    </div>
  );
}

export default App;
