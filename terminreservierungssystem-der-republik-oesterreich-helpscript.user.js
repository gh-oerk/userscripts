// ==UserScript==
// @name         Terminreservierungssystem der Republik Österreich HelpScript
// @namespace    https://github.com/gh-oerk
// @version      1.0
// @author       gh-oerk
// @description  script
// @match        https://appointment.bmeia.gv.at/HomeWeb/Scheduler
// @match        https://appointment.bmeia.gv.at/HomeWeb/Appointment
// @match        https://appointment.bmeia.gv.at/*
// @icon         https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.oesterreich.gv.at%2Fdam%2Fjcr%3Ad3452971-9a43-455a-afec-1dd27f17a2c6%2Fapple-touch-icon.png
// @grant        none
// @downloadURL  https://github.com/gh-oerk/userscripts/raw/main/terminreservierungssystem-der-republik-oesterreich-helpscript.user.js
// @updateURL    https://github.com/gh-oerk/userscripts/raw/main/terminreservierungssystem-der-republik-oesterreich-helpscript.user.js
// ==/UserScript==

// @icon         https://external-content.duckduckgo.com/ip3/www.bmeia.gv.at.ico

window.noenter = () => {
	cc_an_filter();
	return !(window.event && window.event.keyCode == 13);
}

function cc_an_tick() {

	if (!document.getElementById('CountryFilter')) {
		if (document.getElementById('Country')) {
			document.querySelector('#main > form table > tbody').innerHTML = `<tr><td align="right">Save/Load Person</td>
<td>
<button type="button" onclick="cc_an_save()">Save current</button>
<button type="button" onclick="cc_an_load()">Load stored</button>
</td>
</tr><tr><td align="right">Filter Countries</td>
<td>
<input class="text-edit" id="CountryFilter" type="text" value="" onkeypress="return noenter()" style="margin-right: 0.6rem"><button type="button" onclick="cc_an_filter()">Filter</button>
</td>
</tr>`+document.querySelector('#main > form table > tbody').innerHTML;

		}
	}

    if (document.getElementById('Language')) {
let s = document.getElementById('Language');
        if (s.value != "de") {
s.value = "de";
            s.form.submit();
        }

    }

}

const cc_an_select_ids = ["Country", "NationalityAtBirth", "CountryOfBirth", "NationalityForApplication", "TraveldocumentIssuingAuthority"];

window.cc_an_filter = () => {
	let search = document.getElementById('CountryFilter').value;

    let search_arr = search.split(",");

	cc_an_select_ids.forEach(sid => {
		document.querySelectorAll(`select#${sid} > option`).forEach(el => {
			el.style.display = "none"
		});

		document.querySelectorAll(`select#${sid} > option`).forEach(el => {
			search_arr.forEach(st => {
                if (el.textContent.toLocaleLowerCase().includes(st.toLocaleLowerCase())) {
                    el.style.display = "unset";
                }
            })

			
		})
	})

}

const cc_an_save_exclusion_ids = ["Firstname", "TraveldocumentNumber", "CaptchaText", "DateOfBirth", "Sex"];
const cc_an_save_exclusion_types = ["hidden", "submit", "button"];

window.cc_an_save = () => {
	let form_elements = Array.from(document.querySelector('#main > form').elements);

	let data = {};

	form_elements.forEach(v => {
		if (v.name != "" && v.id != "" && !cc_an_save_exclusion_types.includes(v.type) && !cc_an_save_exclusion_ids.includes(v.id)) {
			data[v.id] = v.value;
		}
	})

	let saved = JSON.stringify(data);
	localStorage.setItem('cc_an_person', saved);
};

window.cc_an_load = () => {
	let stored = localStorage.getItem("cc_an_person");

	if (stored == null) {
		alert("Nothing was stored!");
	} else {

		let data = JSON.parse(stored);

		for (const [key, value] of Object.entries(data)) {
			document.getElementById(key).value = value
		}

	}
};

setInterval(() => cc_an_tick(), 100);



    function printbtn_create() {
        if (!document.getElementById('printbtn')) {
            if (document.querySelector("h2")) {
                if (document.querySelector("h2").textContent == "Bestätigung der Reservierung") {
                    window.print_tm = () => {
                        let reserv_nr = document.querySelector("#main > table > tbody > tr:nth-child(1) > td:nth-child(2) > b").textContent;
                        let embassy = reserv_nr.split("-")[1];
                        let embassy_capital = embassy.substring(0, 1) + embassy.substring(1).toLocaleLowerCase();

                        let timestring = document.querySelector("#main > table > tbody > tr:nth-child(3) > td:nth-child(2)").textContent;
                        const timestring_format = moment(timestring, 'DD.MM.YYYY HH:mm').format("YYYY-MM-DD HH.mm");

                        let filestr = `Termin ÖB ${embassy_capital} ${timestring_format} Uhr.pdf`;

                        const type = "text/plain";
                        const blob = new Blob([filestr], {
                            type
                        });
                        const data = [new ClipboardItem({
                            [type]: blob
                        })];

                        navigator.clipboard.write(data)

                        window.print();

                    };

                    document.head.innerHTML += `<style>@media print {.noPrint {display:none;}}</style>`;

                    document.body.innerHTML += `<button onclick="window.print_tm()" class="noPrint" id="printbtn">Print Page</button>`;
                }


            }

        }
    }

    setInterval(() => {
        if (!document.getElementById('moment-js')) {

            const momentscript = document.createElement("script");
            momentscript.src = "https://unpkg.com/moment@2.29.4/min/moment.min.js"
            momentscript.id = 'moment-js'
            document.head.appendChild(momentscript);

        }

        printbtn_create()
    }, 1000);
