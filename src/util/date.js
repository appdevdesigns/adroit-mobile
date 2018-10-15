import { default as dateFormat } from 'date-fns/format';
// TBD: Which locales do we want to support?
import en from 'date-fns/locale/en';
import th from 'date-fns/locale/th';
import zh_tw from 'date-fns/locale/zh_tw';
import zh_cn from 'date-fns/locale/zh_cn';
import Locale from 'react-native-locale';

console.log('Locale', Locale.constants());

const localeId = Locale.constants().localeIdentifier;

const locales = {
  en,
  en_US: en,
  th,
  zh_tw,
  zh_cn,
};

export const format = (date, formatStr) => {
  return dateFormat(date, formatStr, {
    locale: locales[localeId.toLowerCase()] || locales.en,
  });
};
