import type React from 'react';

import type { ChildrenProp } from '../../../types/type';

export default function Main({ children }: ChildrenProp): React.ReactNode {
  return <main>{children}</main>;
}
