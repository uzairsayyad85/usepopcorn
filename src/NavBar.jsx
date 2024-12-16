/* eslint-disable react/prop-types */
import Logo from "./components/navbar/Logo";

export default function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}
