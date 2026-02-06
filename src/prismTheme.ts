import type { PrismTheme } from 'prism-react-renderer';
import { themes as prismThemes, themes } from 'prism-react-renderer';

const customPrismTheme: PrismTheme = {
    ...themes.dracula,
    plain: {
        ...themes.dracula.plain,
        backgroundColor: '#141414',
    }
}

export default customPrismTheme;