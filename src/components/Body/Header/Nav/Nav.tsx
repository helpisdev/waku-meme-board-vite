import { ReactiveNavPart } from "./ReactiveNavPart";

export function Nav() {
  return (
    <nav
      className="bg-subtle dark:bg-subtle-dark flex-no-wrap relative flex w-full items-center justify-between py-2 shadow-md shadow-black/5 dark:shadow-black/10 lg:flex-wrap lg:justify-start lg:py-4"
      data-te-navbar-ref
    >
      <ReactiveNavPart />
    </nav>
  );
}
