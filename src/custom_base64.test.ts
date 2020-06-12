import { ValeriaEncode, ValeriaDecodeToPdchu } from "./custom_base64";

test("Decode Valeria encoding", () => {
    const encoding = "AgLSi06BMUUUUUVjSCziqXARwQQbois4qlIEcEEG6IrOypGBHBBBjmCzsl+ATFFFFFFY5gBaUWtQI4IIMaQIUQAAMbQIUQAAMbQIUQAAMbQIUQAAMbQA";
    const pdchu = "5780 (5789| lv1)[sdr,sdr,sdr,sdr,sdr,sdr] | lv99 awk4 / 5745 (5422| lv1)[dres+,dres+,dres+] | lv110 awk8 sa1 / 5745 (5417| lv1)[dres+,dres+,dres+] | lv110 awk8 sa1 / 5750 (5411| lv1)[dres+,dres+,dres+] | lv99 awk9 / 5750 (4860| lv1)[sdr,sdr,sdr,sdr,sdr,sdr] | lv99 awk9 ; 5780 (5813| lv1)[dres+,dres+,dres+] | lv99 awk4 / 2129 | lv99 awk6 / 2129 | lv99 awk6 / 2129 | lv99 awk6 / 2129 | lv99 awk6 "
    expect(ValeriaDecodeToPdchu(encoding).pdchu).toBe(pdchu); // Encoding is random yugi team
    expect(ValeriaDecodeToPdchu(encoding).badges).toStrictEqual([0,0,0]); //No badges
})