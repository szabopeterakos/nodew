import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';

// this is the entry point -> all of our javascript
// this is where webpack boundling them together

// modules directory | all of the client side modules happend

autocomplete($('#address'), $('#lat'), $('#lng'));
