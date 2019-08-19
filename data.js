/** Generation of the team data:
 *
async function getTeams() {
  let teams = [];
  let resp = await fetch("https://api.overwatchleague.com/teams?expand=team.content&locale=en-us");
  let data = await resp.json();
  for (let w of data.competitors) {
    let c = w.competitor;
    delete c.accounts;
    delete c.addressCountry;
    delete c.attributesVersion;
    delete c.availableLanguages;
    delete c.game;
    delete c.owl_division;
    delete c.players;
    delete c.secondaryPhoto;
    delete c.handle;
    delete c.type;
    c.team_guid = c.attributes.team_guid;
    delete c.attributes;
    c.colors = c.content.colors;
    c.icons = c.content.icons;
    delete c.content;
    delete c.primaryColor;
    delete c.secondaryColor;
    delete c.icon;
    delete c.logo;

    teams.push(c);
  }

  return teams;
}
getTeams().then(t => console.log(JSON.stringify(t)));
// */
const teamData = [{ "id": 4523, "name": "Dallas Fuel", "homeLocation": "Dallas, TX", "abbreviatedName": "DAL", "team_guid": "0x0D70000000000002", "colors": [{ "name": "Dallas Navy", "usage": "primary", "color": { "color": "#032340", "opacity": 1 } }, { "name": "Dallas Blue", "usage": "secondary", "color": { "color": "#0072CE", "opacity": 1 } }, { "name": "Dallas Gray", "usage": "tertiary", "color": { "color": "#9EA2A2", "opacity": 1 } }], "icons": [{ "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/NO44N7DDJAPF1508792362936.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/template_resource/YX6JZ6FR89LU1507822882865.svg", "usage": "main" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/Q8TMKNUFIJL51519747890664.svg", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/Q8TMKNUFIJL51519747890664.svg", "usage": "mainName" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/YUUL7E0CSF591544055626557.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/LLMV1UTBVHN11544055825034.svg", "usage": "altDark" }] }, { "id": 4524, "name": "Philadelphia Fusion", "homeLocation": "Philadelphia, PA", "abbreviatedName": "PHI", "team_guid": "0x0D70000000000009", "colors": [{ "name": "Philadelphia Orange", "usage": "tertiary", "color": { "color": "#F99E29", "opacity": 1 } }, { "name": "Philadelphia Black", "usage": "primary", "color": { "color": "#000000", "opacity": 1 } }, { "name": "Philadelphia Gray", "usage": "secondary", "color": { "color": "#DCDCDC", "opacity": 1 } }], "icons": [{ "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/3JZTLCPH37QD1508792362853.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/template_resource/LAKZ6R7QEG6S1507822883033.svg", "usage": "main" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/gallery/BI9AZG2WTOCE1544642967810.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/gallery/LO77CFOVQWS11544642971088.svg", "usage": "alt" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/gallery/NHCAR82UZJUK1544642802896.svg", "svg": "https://bnetcmsus-a.akamaihd.net/cms/gallery/NHCAR82UZJUK1544642802896.svg", "usage": "mainName" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/TVS7JDXJBWM81544055687151.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/52QPF1MPBXVX1544055975338.svg", "usage": "altDark" }] }, { "id": 4525, "name": "Houston Outlaws", "homeLocation": "Houston, TX", "abbreviatedName": "HOU", "team_guid": "0x0D70000000000007", "colors": [{ "name": "Houston Green", "usage": "secondary", "color": { "color": "#97D700", "opacity": 1 } }, { "name": "Houston Black", "usage": "primary", "color": { "color": "#000000", "opacity": 1 } }, { "name": "Houston White", "usage": "tertiary", "color": { "color": "#FFFFFF", "opacity": 1 } }], "icons": [{ "png": "https://bnetcmsus-a.akamaihd.net/cms/gallery/2YF5VLIMGZVA1546557680222.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/gallery/BGP1O8PKAI091546557676638.svg", "usage": "main" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/gallery/46H5JPPV59Z51546557672375.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/gallery/ZZZ1WAZ79E3D1546557668570.svg", "usage": "alt" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/gallery/6LPXHIRHCQTR1546557663345.svg", "svg": "https://bnetcmsus-a.akamaihd.net/cms/gallery/6LPXHIRHCQTR1546557663345.svg", "usage": "mainName" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/EEU1R8LF91VP1544055641426.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/MJLP7QICH5JP1544055906758.svg", "usage": "altDark" }] }, { "id": 4402, "name": "Boston Uprising", "homeLocation": "Boston, MA", "abbreviatedName": "BOS", "team_guid": "0x0D70000000000001", "colors": [{ "name": "Boston Blue", "usage": "primary", "color": { "color": "#174B97", "opacity": 1 } }, { "name": "Boston Yellow", "usage": "secondary", "color": { "color": "#EFDF00", "opacity": 1 } }, { "name": "Boston Black", "usage": "tertiary", "color": { "color": "#000000", "opacity": 1 } }], "icons": [{ "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/8RS25ECY3PZH1515523733716.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/LB92M6PBO3X81515523733716.svg", "usage": "alt" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/43UINMGMA83X1513383982827.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/W4FGQ24HKCB51513383982827.svg", "usage": "main" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/6L8FEHO4JUB51519747890656.svg", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/6L8FEHO4JUB51519747890656.svg", "usage": "mainName" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/8RS25ECY3PZH1515523733716.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/LB92M6PBO3X81515523733716.svg", "usage": "altDark" }] }, { "id": 4403, "name": "New York Excelsior", "homeLocation": "New York City, NY", "abbreviatedName": "NYE", "team_guid": "0x0D70000000000008", "colors": [{ "name": "New York Navy", "usage": "primary", "color": { "color": "#171C38", "opacity": 1 } }, { "name": "New York Blue", "usage": "secondary", "color": { "color": "#0F57EA", "opacity": 1 } }, { "name": "New York Red", "usage": "tertiary", "color": { "color": "#FF1C26", "opacity": 1 } }], "icons": [{ "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/9r/9RYLM8FICLJ01508818792450.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/jz/JZHJUJ8QM1AP1508818097057.svg", "usage": "alt" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/3BJYLE1WK82R1517250447968.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/3PBR8VEYM8SH1517250447953.svg", "usage": "main" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/3FXYFS8XQC7C1519747890817.svg", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/3FXYFS8XQC7C1519747890817.svg", "usage": "mainName" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/FVDC5D3YQ33E1544055672372.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/PTX7PFVTAAZS1544055952805.svg", "usage": "altDark" }] }, { "id": 4404, "name": "San Francisco Shock", "homeLocation": "San Francisco, CA", "abbreviatedName": "SFS", "team_guid": "0x0D7000000000000A", "colors": [{ "name": "Shock Gray", "usage": "primary", "color": { "color": "#75787B", "opacity": 1 } }, { "name": "Shock Orange", "usage": "secondary", "color": { "color": "#FC4C02", "opacity": 1 } }, { "name": "Shock Gold", "usage": "tertiary", "color": { "color": "#CAB64B", "opacity": 1 } }], "icons": [{ "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/YO24NN5KAOFL1508792362791.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/template_resource/0SY7LHKHV86R1507822883113.svg", "usage": "main" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/gallery/ux/UXJQ4UM6HEED1544641659418.svg", "svg": "https://bnetcmsus-a.akamaihd.net/cms/gallery/ux/UXJQ4UM6HEED1544641659418.svg", "usage": "mainName" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/YO24NN5KAOFL1508792362791.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/template_resource/0SY7LHKHV86R1507822883113.svg", "usage": "altDark" }] }, { "id": 4405, "name": "Los Angeles Valiant", "homeLocation": "Los Angeles, CA", "abbreviatedName": "VAL", "team_guid": "0x0D70000000000005", "colors": [{ "name": "Valiant Green", "usage": "primary", "color": { "color": "#004438", "opacity": 1 } }, { "name": "Valiant Black", "usage": "secondary", "color": { "color": "#000000", "opacity": 1 } }, { "name": "Valiant Gold", "usage": "tertiary", "color": { "color": "#D9C756", "opacity": 1 } }], "icons": [{ "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/0D8BNUWVZP6B1508792362890.PNG", "svg": "https://bnetcmsus-a.akamaihd.net/cms/template_resource/L3U59GQVS1ZK1507822882879.svg", "usage": "main" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/DNLJ56ABAOLP1519747890885.svg", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/DNLJ56ABAOLP1519747890885.svg", "usage": "mainName" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/0D8BNUWVZP6B1508792362890.PNG", "svg": "https://bnetcmsus-a.akamaihd.net/cms/template_resource/L3U59GQVS1ZK1507822882879.svg", "usage": "altDark" }] }, { "id": 4406, "name": "Los Angeles Gladiators", "homeLocation": "Los Angeles, CA", "abbreviatedName": "GLA", "team_guid": "0x0D70000000000004", "colors": [{ "name": "Gladiator Purple", "usage": "primary", "color": { "color": "#3C1053", "opacity": 1 } }, { "name": "Gladiator Black", "usage": "secondary", "color": { "color": "#000000", "opacity": 1 } }, { "name": "Gladiator White", "usage": "tertiary", "color": { "color": "#FFFFFF", "opacity": 1 } }], "icons": [{ "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/3AEMOZZL76PF1508792362892.PNG", "svg": "https://bnetcmsus-a.akamaihd.net/cms/template_resource/CHTRRZCBEYGN1507822882862.svg", "usage": "main" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/01NO2I1B84CF1512520986350.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/HU1A12H9JPNS1512520986367.svg", "usage": "alt" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/92RXGEWTP0B11519747890766.svg", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/92RXGEWTP0B11519747890766.svg", "usage": "mainName" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/O9BE1LQSQN1C1544055646937.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/NCT1WP6NKDFS1544055915971.svg", "usage": "altDark" }] }, { "id": 4407, "name": "Florida Mayhem", "homeLocation": "Florida", "abbreviatedName": "FLA", "team_guid": "0x0D70000000000006", "colors": [{ "name": "Florida Yellow", "usage": "primary", "color": { "color": "#FEDB00", "opacity": 1 } }, { "name": "Florida Red", "usage": "secondary", "color": { "color": "#AF272F", "opacity": 1 } }, { "name": "Florida Black", "usage": "tertiary", "color": { "color": "#000000", "opacity": 1 } }], "icons": [{ "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/4GO273NATVWM1508792362854.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/template_resource/M1KNTZW8SGHZ1507822883041.svg", "usage": "main" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/ZZIV9VLD5UO21512520986438.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/8G57V3BPG1MV1512520986448.svg", "usage": "alt" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/FQBVNDFO99P21519747890664.svg", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/FQBVNDFO99P21519747890664.svg", "usage": "mainName" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/4GO273NATVWM1508792362854.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/template_resource/M1KNTZW8SGHZ1507822883041.svg", "usage": "altDark" }] }, { "id": 4408, "name": "Shanghai Dragons", "homeLocation": "Shanghai", "abbreviatedName": "SHD", "team_guid": "0x0D7000000000000C", "colors": [{ "name": "Shanghai Red", "usage": "primary", "color": { "color": "#D22630", "opacity": 1 } }, { "name": "Shanghai Black", "usage": "secondary", "color": { "color": "#000000", "opacity": 1 } }, { "name": "Shanghai Yellow", "usage": "tertiary", "color": { "color": "#FCE300", "opacity": 1 } }], "icons": [{ "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/B0R64QSNCDLX1508792362793.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/template_resource/ZIVUVIWXNIFL1507822883114.svg", "usage": "main" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/F7T6ISEVW0NN1512520986578.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/MHYBGBXKCBWW1512520986598.svg", "usage": "alt" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/M703QHV3B6ZC1519747890887.svg", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/M703QHV3B6ZC1519747890887.svg", "usage": "mainName" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/TGZYGC96SYHP1544055708493.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/CZQND87P06NN1544055996911.svg", "usage": "altDark" }] }, { "id": 4409, "name": "Seoul Dynasty", "homeLocation": "Seoul", "abbreviatedName": "SEO", "team_guid": "0x0D7000000000000B", "colors": [{ "name": "Dynasty Black", "usage": "primary", "color": { "color": "#000000", "opacity": 1 } }, { "name": "Dynasty Gold", "usage": "secondary", "color": { "color": "#AA8A00", "opacity": 1 } }, { "name": "Dynasty White", "usage": "tertiary", "color": { "color": "#FFFFFF", "opacity": 1 } }], "icons": [{ "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/LHRSIW3NWH211508792362796.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/E9MU0AK0JIXT1507858876249.svg", "usage": "main" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/PALRGLF8SMMC1519747890813.svg", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/PALRGLF8SMMC1519747890813.svg", "usage": "mainName" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/LHRSIW3NWH211508792362796.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/E9MU0AK0JIXT1507858876249.svg", "usage": "altDark" }] }, { "id": 4410, "name": "London Spitfire", "homeLocation": "London", "abbreviatedName": "LDN", "team_guid": "0x0D70000000000003", "colors": [{ "name": "London Blue (switched for engineering needs)", "usage": "primary", "color": { "color": "#59CBE8", "opacity": 1 } }, { "name": "London Orange (switched for engineering needs)", "usage": "secondary", "color": { "color": "#FF8200", "opacity": 1 } }, { "name": "London Navy (switched for engineering needs)", "usage": "tertiary", "color": { "color": "#1C2B39", "opacity": 1 } }], "icons": [{ "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/NW461AQIYQMK1508792363133.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/template_resource/HCS229B4DP021507822883016.svg", "usage": "main" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/9X0RTOLWRG231519747890764.svg", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/9X0RTOLWRG231519747890764.svg", "usage": "mainName" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/NW461AQIYQMK1508792363133.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/template_resource/HCS229B4DP021507822883016.svg", "usage": "main" }] }, { "id": 7692, "name": "Chengdu Hunters", "homeLocation": "Chengdu", "abbreviatedName": "CDH", "team_guid": "0x0D7000000000005F", "colors": [{ "name": "Hunters Orange", "usage": "primary", "color": { "color": "#FFA000", "opacity": 1 } }, { "name": "Hunters Beige", "usage": "secondary", "color": { "color": "#B4926A", "opacity": 1 } }, { "name": "Hunters Dark Gray", "usage": "tertiary", "color": { "color": "#161823", "opacity": 1 } }], "icons": [{ "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/st/STKSER89UHKO1542674031469.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/65/652SCYN8YQPB1542674099514.svg", "usage": "main" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/gallery/K4COQFVPBOPH1541541301546.svg", "svg": "https://bnetcmsus-a.akamaihd.net/cms/gallery/K4COQFVPBOPH1541541301546.svg", "usage": "mainName" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/VSAVRBWU5F321544055622417.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/YO93H9VU2UYE1544055820403.svg", "usage": "altDark" }] }, { "id": 7693, "name": "Hangzhou Spark", "homeLocation": "Hangzhou", "abbreviatedName": "HZS", "team_guid": "0x0D7000000000005B", "colors": [{ "name": "Spark Pink", "usage": "primary", "color": { "color": "#FB7299", "opacity": 1 } }, { "name": "Spark Blue", "usage": "secondary", "color": { "color": "#5788CE", "opacity": 1 } }, { "name": "Spark White", "usage": "tertiary", "color": { "color": "#FFFFFF", "opacity": 1 } }], "icons": [{ "png": "https://bnetcmsus-a.akamaihd.net/cms/gallery/QQ8MNSYYJGDK1544640571357.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/gallery/ZQTMF62BVMHV1544640580461.svg", "usage": "main" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/TJ9I5I8BFC5J1542674380020.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/S01ILBOS6OZ71542674323474.svg", "usage": "alt" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/gallery/W4B278H4M1T01541541301781.svg", "svg": "https://bnetcmsus-a.akamaihd.net/cms/gallery/W4B278H4M1T01541541301781.svg", "usage": "mainName" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/QW4QD06XJUZY1544055635729.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/J0TQAJXNO5YC1544055844033.svg", "usage": "altDark" }] }, { "id": 7694, "name": "Paris Eternal", "homeLocation": "Paris", "abbreviatedName": "PAR", "team_guid": "0x0D70000000000059", "colors": [{ "name": "Eternal Steel", "usage": "primary", "color": { "color": "#303D56", "opacity": 1 } }, { "name": "Eternal Red", "usage": "secondary", "color": { "color": "#8D042D", "opacity": 1 } }, { "name": "Eternal Orange", "usage": "tertiary", "color": { "color": "#FFAA1D", "opacity": 1 } }], "icons": [{ "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/qm/QM7JE0THABVT1542674071412.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/w4/W4C99JABL26E1542674142979.svg", "usage": "main" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/gallery/1DJR8B3JN4WT1541541301789.svg", "svg": "https://bnetcmsus-a.akamaihd.net/cms/gallery/1DJR8B3JN4WT1541541301789.svg", "usage": "mainName" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/CDLGF687JK601544055680665.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/3D6YAD9OZ9H41544055964274.svg", "usage": "altDark" }] }, { "id": 7695, "name": "Toronto Defiant", "homeLocation": "Toronto", "abbreviatedName": "TOR", "team_guid": "0x0D70000000000057", "colors": [{ "name": "Defiant Black", "usage": "primary", "color": { "color": "#000000", "opacity": 1 } }, { "name": "Defiant Red", "usage": "secondary", "color": { "color": "#C10021", "opacity": 1 } }, { "name": "Defiant Gray", "usage": "tertiary", "color": { "color": "#91A1AF", "opacity": 1 } }], "icons": [{ "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/g0/G05QL2P5A92E1542674081932.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/vc/VCXAU8C5WLJT1542674151813.svg", "usage": "main" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/H8QUA3VTDY391542674380168.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/9SKE6JTBP4JL1542674329907.svg", "usage": "alt" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/gallery/JMK8L4YYYNR81541541301792.svg", "svg": "https://bnetcmsus-a.akamaihd.net/cms/gallery/JMK8L4YYYNR81541541301792.svg", "usage": "mainName" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/DEZQ2KQFS7FC1544055716196.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/JSRSX9J4F0HY1544056004176.svg", "usage": "altDark" }] }, { "id": 7696, "name": "Vancouver Titans", "homeLocation": "Vancouver", "abbreviatedName": "VAN", "team_guid": "0x0D70000000000055", "colors": [{ "name": "Titan Blue", "usage": "primary", "color": { "color": "#09226B", "opacity": 1 } }, { "name": "Titan Green", "usage": "secondary", "color": { "color": "#2FB228", "opacity": 1 } }, { "name": "Titan White", "usage": "tertiary", "color": { "color": "#FFFFFF", "opacity": 1 } }], "icons": [{ "png": "https://bnetcmsus-a.akamaihd.net/cms/gallery/F1WE9LBKIGHD1543976752064.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/gallery/0KOSPFU6UC411543976755522.svg", "usage": "main" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/gallery/K4OO4HAOUWWH1543976763453.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/gallery/PFQQSH405YFS1543976759565.svg", "usage": "alt" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/gallery/LLDR7VZ510BN1543976768177.svg", "svg": "https://bnetcmsus-a.akamaihd.net/cms/gallery/LLDR7VZ510BN1543976768177.svg", "usage": "mainName" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/35QR87XB3X9J1544055721750.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/3U5YDUD6JRGK1544056009724.svg", "usage": "altDark" }] }, { "id": 7697, "name": "Washington Justice", "homeLocation": "Washington, DC", "abbreviatedName": "WAS", "team_guid": "0x0D70000000000053", "colors": [{ "name": "Justice Red", "usage": "primary", "color": { "color": "#990034", "opacity": 1 } }, { "name": "Justice Blue", "usage": "secondary", "color": { "color": "#003768", "opacity": 1 } }, { "name": "Justice White", "usage": "tertiary", "color": { "color": "#FFFFFF", "opacity": 1 } }], "icons": [{ "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/95UE5OJKSFQF1543968718489.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/VH7IGPLX4UJ61543968702521.svg", "usage": "main" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/gallery/5PJ70D8IZIYS1543975994431.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/05CTK90OG1N31543969005948.svg", "usage": "alt" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/gallery/2YGP6C7VUQLY1541536094681.svg", "svg": "https://bnetcmsus-a.akamaihd.net/cms/gallery/2YGP6C7VUQLY1541536094681.svg", "usage": "mainName" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/GOQB6JN0J0191544055725234.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/OYO5HG0DWGCE1544056019664.svg", "usage": "altDark" }] }, { "id": 7698, "name": "Atlanta Reign", "homeLocation": "Atlanta, GA", "abbreviatedName": "ATL", "team_guid": "0x0D70000000000061", "colors": [{ "name": "Reign Light Gray", "usage": "primary", "color": { "color": "#C4C4C4", "opacity": 1 } }, { "name": "Reign Red", "usage": "secondary", "color": { "color": "#910F1B", "opacity": 1 } }, { "name": "Reign Dark Grey", "usage": "tertiary", "color": { "color": "#323232", "opacity": 1 } }], "icons": [{ "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/32/32MTX0PLEDY31542673991836.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/60/609VVM89F1BY1542673347592.svg", "usage": "main" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/gallery/F7GNJ0AOZG9F1541541301534.svg", "svg": "https://bnetcmsus-a.akamaihd.net/cms/gallery/F7GNJ0AOZG9F1541541301534.svg", "usage": "mainName" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/u8/U8GNT5WY682N1544054371697.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/pl/PLDS7PJMC6V11544055443407.svg", "usage": "altDark" }] }, { "id": 7699, "name": "Guangzhou Charge", "homeLocation": "Guangzhou", "abbreviatedName": "GZC", "team_guid": "0x0D7000000000005D", "colors": [{ "name": "Charge Dark Blue", "usage": "primary", "color": { "color": "#122C42", "opacity": 1 } }, { "name": "Charge Teal", "usage": "secondary", "color": { "color": "#67A2B2", "opacity": 1 } }, { "name": "Charge Turquoise", "usage": "tertiary", "color": { "color": "#0FEFD9", "opacity": 1 } }], "icons": [{ "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/sz/SZQVDGE3F1TE1542674048320.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/d4/D4ITOG4F5WX01542674113751.svg", "usage": "main" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/gallery/SHU9HWDMVK391541541301535.svg", "svg": "https://bnetcmsus-a.akamaihd.net/cms/gallery/SHU9HWDMVK391541541301535.svg", "usage": "mainName" }, { "png": "https://bnetcmsus-a.akamaihd.net/cms/page_media/WFTDS7FURZ3L1544055630545.png", "svg": "https://bnetcmsus-a.akamaihd.net/cms/page_media/OPS32KD180BL1544055837626.svg", "usage": "altDark" }] }];

// Helper functions to deal with this data
function getTeamIcon(team, usage) {
  for (let icon of team.icons) {
    if (icon.usage == usage) {
      return icon;
    }
  }
}

function getTeamColor(team, usage) {
  for (let color of team.colors) {
    if (color.usage == usage) {
      return color.color;
    }
  }
}

function findTeamById(id) {
  for (let team of teamData) {
    if (team.id == id) {
      return team;
    }
  }
}
