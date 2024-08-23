import {reactive} from "vue";

export default function () {
    const timeMask = reactive({
        mask: (value) => value.startsWith('1') ? 'Hm:Mm' : 'Hh:Mm',
        tokens: {
            'H': {
                pattern: /[0-2]/
            },
            'h': {
                pattern: /[0-3]/
            },
            'M': {
                pattern: /[0-5]/
            },
            'm': {
                pattern: /[0-9]/
            },
        }
    })
    const dateMask = reactive({
        mask: (value) => {
            let day = value.startsWith('3') ? 'Dc' : value.startsWith('0') ? 'Db' : 'Da';
            let month = value[3] === '1' ? 'Me' : 'Ma';
            let year = 'Yyyy';

            return `${day}.${month}.${year}`;
        },
        tokens: {
            'D': { pattern: /[0-3]/ },
            'a': { pattern: /[0-9]/ },
            'b': { pattern: /[1-9]/ },
            'c': { pattern: /[0-1]/ },
            'e': { pattern: /[0-2]/ },
            'M': { pattern: /[0-1]/ },
            'Y': { pattern: /[1-2]/ },
            'y': { pattern: /[0-9]/ }
        }
    });

    return {timeMask, dateMask}
}
