// generate a regex
const searchTerms = ['foo', 'bar'];
const regex = new RegExp(searchTerms.join('|'), 'gi');
console.log('🤖 ~ file: instancesFinders.ts ~ line 4 ~ regex', regex);
