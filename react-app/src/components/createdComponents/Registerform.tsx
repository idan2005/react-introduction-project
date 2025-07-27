import InputField from "./InputField";
import { Button } from "../ui/button";
function RegisterForm() {
  return (
    <form>
      <h2>Register</h2>
      <InputField label="Username" name="username" required />
      <InputField label="Password" type="password" name="password" required />
      <Button type="submit">Register</Button>
    </form>
  );
}

export default RegisterForm;
