import { Transformers } from './Transformers';
import { GithubLink } from './GithubLink';

export const App = (): string => {
  return `
    <main>
      ${Transformers()}
    </main>
    <footer">
      ${GithubLink()}
    </footer>
    `;
};
