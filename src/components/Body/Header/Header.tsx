import { conf } from "../../../util";
import { Nav } from "./Nav/Nav";
interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header>
      <Nav />
      <div className="px-6 py-20 text-center">
        <h1 className="mb-6 text-5xl font-bold text-high-contrast dark:text-high-contrast-dark">
          {title}
        </h1>
        <h2 className="mb-8 text-3xl font-bold text-high-contrast dark:text-high-contrast-dark">
          {conf.description}
        </h2>
      </div>
    </header>
  );
}
