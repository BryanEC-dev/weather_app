const fs = require('fs')
const { default: axios } = require("axios");
require('dotenv').config();

class Busquedas {
    historial = []
    dbPath = './db/database.json'

    constructor(){
        // TODO: leer db si existe
        this.leerDb()
    }

    get paramsMapbox() {
        return {
            'access_token' : process.env.MAPBOX_KEY,
            'limit' : 5,
            'language' : 'es',
        }
    }

    get paramsWeather() {
        return {
            'appid' : process.env.OPENWEATHER_KEY,
            'units' : 'metric',
            'lang' : 'es'
        }
    }

    get historialCapitalizado(){
        // capitalizar cada palabra

        return this.historial.map( (lugar) => {
            return lugar[0].toLocaleUpperCase() + lugar.slice(1)
        })
    }


    async ciudad(lugar = ''){
        // peticion http
        try {
            const instance = axios.create({
                baseURL : `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params : this.paramsMapbox

            });

            const resp = await instance.get();
            return resp.data.features.map( lugar => ({
                id : lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));

       
        } catch (error) {
            console.log('hubo un error: ',error);
            return [];
        }
        
    }

    async clima(lat = '',lon= '') {
        try {
            const instance = axios.create({
                baseURL : `https://api.openweathermap.org/data/2.5/weather?`,
                params : {...this.paramsWeather, lat, lon}

            });

            const resp = await instance.get();
            const {weather, main} = resp.data

            return {
                'temp' : main.temp,
                'temp_min' : main.temp_min,
                'temp_max' : main.temp_max,
                'descripcion' : weather[0].description,

            }
 
       
        } catch (error) {
            console.log('hubo un error: ',error);
            return [];
        }
    }

    agregarHistorial(lugar = '') {
        
        /* if(this.historial.includes(lugar.toLocaleLowerCase() )) */
        //TODO: PREVENIR DUPLICADOS
        this.historial.unshift(lugar.toLocaleLowerCase());
        this.guardarDb()
    }

    guardarDb() {
        const payload = {
            historial : this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }

    leerDb(){

        console.log('leer db');
        try {
                if (fs.existsSync(this.dbPath)) {
                //file exists
                    let info = fs.readFileSync(this.dbPath,'utf8');
                    let data = JSON.parse(info);
                    this.historial = data.historial
                    this.historial = this.historialCapitalizado
                    
                }else {
                    return
                }
            } catch(err) {
            console.error(err)
            }

        // cargar el historial 

    }
}

module.exports = Busquedas;

