import { Transformers } from './Transformers';
import { GithubLink } from './GithubLink';

export const App = (): string => {
  return `
    <main class="container">
      ${Transformers()}
    </main>
    <footer">
      ${GithubLink()}
    </footer>
    `;
};
