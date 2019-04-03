// Phantombuster configuration {

"phantombuster command: nodejs"
"phantombuster package: 4"
"phantombuster flags: save-folder"

const Buster = require("phantombuster")
const buster = new Buster()

const Nick = require("nickjs")
const nick = new Nick()

// }

/*
	This script parses leroymerlin.ru SPA/Angular for products given that you provide links to parse.
*/
let output = []

const links = [
 /*"/catalogue/elektricheskie-vodonagrevateli-nakopitelnye/",
            "/catalogue/elektricheskie-vodonagrevateli-protochnye/",
            "/catalogue/elektricheskie-vodonagrevateli-nalivnye/",
            "/catalogue/gazovye-vodonagrevateli/",
            "/catalogue/radiatory-alyuminievye/",
            "/catalogue/radiatory-bimetallicheskie/",
            "/catalogue/radiatory-stalnye/",
            "/catalogue/klapany-dlya-radiatorov/",
            "/catalogue/aksessuary-dlya-radiatorov/",
             "/catalogue/polotencesushiteli-vodyanye-i-elektricheskie/",
            "/catalogue/komplekty-dlya-podklyucheniya-polotencesushiteley/",
            "/catalogue/otrazhateli-i-krepleniya-dlya-polotencesushiteley/",
             "/catalogue/sistemy-obratnogo-osmosa/",
            "/catalogue/filtry-protochnye/",
            "/catalogue/kartridzhi-dlya-vody/",
            "/catalogue/krany-chistoy-vody/",
            "/catalogue/filtry-kuvshiny/",
             "/catalogue/kotly-otopitelnye-gazovye/",
            "/catalogue/kotly-otopitelnye-elektricheskie/",
            "/catalogue/kotly-otopitelnye-tverdotoplivnye/",
            "/catalogue/dymohody/",*/
            
            "/catalogue/aksessuary-dlya-kotlov-i-otopiteley/",
            "/catalogue/fitingi-dlya-teplogo-pola/",
            /*"/catalogue/gazovye-teplovye-pushki/",
            "/catalogue/gazovye-ballony/",
            "/catalogue/dizelnye-teplovye-pushki/",
            "/catalogue/infrakrasnye-gazovye-obogrevateli/",
            // "/catalogue/truby/",
            "/catalogue/zapornaya-armatura/",
            "/catalogue/zaporno-reguliruyushchaya-armatura/",
            "/catalogue/kollektory-dlya-vody/",
            "/catalogue/fitingi-dlya-trub/",
            "/catalogue/gibkaya-podvodka-dlya-vody/",
            "/catalogue/gibkaya-podvodka-dlya-gaza/",
            "/catalogue/shlangi-dlya-stiralnyh-mashin/",
            "/catalogue/schetchiki-dlya-vody-i-gaza/",
            "/catalogue/uplotniteli-dlya-trub/",
            "/catalogue/uplotnitelnye-prokladki-i-kolca-dlya-trub/",
            "/catalogue/izolyaciya-dlya-trub/",
            "/catalogue/komplektuyushchie-dlya-smesiteley/",
            "/catalogue/truby-i-fitingi-iz-stali/",
            "/catalogue/truby-dlya-vnutrenney-kanalizacii/",
            "/catalogue/sifony-i-trapy/",
        
            "/catalogue/gofrirovannye-truby-dlya-sifona/",
            "/catalogue/armatura-dlya-slivnyh-bachkov-unitazov/",
            "/catalogue/gofrirovannye-truby-i-manzhety-dlya-unitaza/",
            "/catalogue/prokladki-i-manzhety-dlya-kanalizacii/",
            "/catalogue/kulery-dlya-vody/",
             "/catalogue/gidroakkumulyatory/",
            "/catalogue/sanitarnye-nasosy/",
            "/catalogue/cirkulyacionnye-nasosy/",
             "/catalogue/magistralnye-filtry-dlya-vody/",
            "/catalogue/filtruyushchie-materialy-dlya-vody/",
            "/catalogue/filtry-gruboy-ochistki-vody/",
             "/catalogue/teplonositel/",
              "/catalogue/aksessuary-dlya-trub/",
            "/catalogue/instrumenty-dlya-trub/",
            "/catalogue/truby-dlya-teplogo-pola/",
            "/catalogue/fitingi-dlya-teplogo-pola/",
            "/catalogue/komplektuyushchie-dlya-teplogo-pola/",
            "/catalogue/kollektornaya-gruppa-dlya-teplogo-pola/",
            "/catalogue/smesitelnye-uzly-dlya-teplogo-pola/"*/
            ];
const baseUrl = "https://leroymerlin.ru"


//links.forEach(function(link){
nick.newTab().then(async (tab) => {

	let result = []
	for (link of links) {
	 await tab.open(baseUrl + link)
	//await tab.inject("../injectables/jquery-3.0.0.min.js") // We're going to use jQuery to scrape
	await tab.untilVisible(".catalog__name") // Make sure we have loaded the right page
    console.log(link);
    const firstLink = await tab.evaluate((arg, callback) => {
     const data = []
      $("p.catalog__name").each((index, element) => {
        data.push({
          //title: $(element).find('a').text(),
          url: $(element).find('a').attr('href')
        })
      })
      callback(null, data)
    })
    await tab.open(baseUrl + firstLink[0].url)
    await tab.untilVisible("table.about__params__table")
    
	// Evaluate a function in the current page DOM context. Execution is sandboxed: page has no access to the Nick context
	// In other words: Open the browser inspector to execute this function in the console
	
	const parametrs = await tab.evaluate((arg, callback) => {
      const data = []
      let merge = {}
      let merge1 = {}
      let merge2 = {}
      let merge3 = {}
      $("table.about__params__table tr").each((index, element) => {
        data.push({
          name: ($(element).find('td').eq(0).text()).replace('\n', '').trim(),
          value: ($(element).find('td').eq(1).text()).replace('\n', '').replace('?', '').trim()
        })
       
       
      })
       $(".breadscrumbs").each((index, element) => {
     var menu1 = $(element).find('.breadscrumbs__item').eq(2).text()
     var menu2 = $(element).find('.breadscrumbs__item').eq(3).text()
     var menu3 = $(element).find('.breadscrumbs__item').eq(4).text()
       merge[menu3] = data
       merge1[menu2] = merge
       merge2[menu1] = merge1
       
      })
	
      callback(null, merge2)
     
    })
	result = parametrs
    output.push(parametrs)
}
 await buster.setResultObject(output)
})
.then(() => {
	console.log("Job done!")

	nick.exit()
})
.catch((err) => {
	console.log(`Something went wrong: ${err}`)
	nick.exit(1)
})
