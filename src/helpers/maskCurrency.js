export const getMask = (value) => {
    let mask = '### ### ### ###'

    switch (value.replaceAll(' ', '').length) {
        case 1:
            mask = '#'
            break
        case 2:
            mask = '##'
            break
        case 3:
            mask = '###'
            break
        case 4:
            mask = '# ###'
            break
        case 5:
            mask = '## ###'
            break
        case 6:
            mask = '### ###'
            break
        case 7:
            mask = '# ### ###'
            break
        case 8:
            mask = '## ### ###'
            break
        case 9:
            mask = '### ### ###'
            break
        case 10:
            mask = '# ### ### ###'
            break
        case 11:
            mask = '## ### ### ###'
            break
        case 12:
            mask = '### ### ### ###'
            break
    }

    return mask
}
