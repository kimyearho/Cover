/**
 * 유튜브 재생길이를 초단위로 변환
 *
 * @param {*} n - ISO String
 */
export function convertToSeconds(n) {
    let reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
    let hours = 0;

    let minutes = 0;

    let seconds = 0;

    let totalseconds;
    if (reptms.test(n)) {
        let matches = reptms.exec(n);
        if (matches[1]) hours = Number(matches[1]);
        if (matches[2]) minutes = Number(matches[2]);
        if (matches[3]) seconds = Number(matches[3]);
        totalseconds = hours * 3600 + minutes * 60 + seconds;
    }
    return totalseconds;
}

/**
 * 초 단위를 0:00와 같은 문자포맷으로 치환
 *
 * @param {*} s - 재생시간(단위:초)
 */
export function secondFormat(sa) {
    let d = Number(sa);
    let h = Math.floor(d / 3600);
    let m = Math.floor((d % 3600) / 60);
    let s = Math.floor((d % 3600) % 60);
    return (
        (h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") +
        m +
        ":" +
        (s < 10 ? "0" : "") +
        s
    );
}