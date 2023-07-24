import type { ChildrenProp } from "../../type";
import { Footer } from "./Footer/Footer";
import { Header } from "./Header/Header";
import { Main } from "./Main/Main";

interface BodyProps {
  title: string;
}

export function Body({ title, children }: BodyProps & ChildrenProp) {
  return (
    <body className="bg-app dark:bg-app-dark">
      <Header title={title} />
      <Main>{children}</Main>
      <Footer />
    </body>
  );
}
