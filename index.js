const { green } = require("colors");
const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");


const main = async() => {
   let opt
   const busquedas = new Busquedas();

   do{
       opt = await inquirerMenu();

       switch(opt){
           case 1 :
               // mostrar mensaje
                const lugar = await leerInput('Ciudad: ');
    
               // buscar los lugares
               const lugares = await busquedas.ciudad(lugar)
               
            

               // seleccionar el lugar
               const id = await listarLugares(lugares)
               
               if (id === '0')  continue;

               const lugarSel = lugares.find( lugar => lugar.id === id)

               // Guardar registro
               busquedas.agregarHistorial(lugarSel.nombre)

               // obtener el clima
               const clima = await busquedas.clima(lugarSel.lat,lugarSel.lng)
               
               // Mostrar resultados
               console.log('\n Información de la ciudad\n'.green);
               console.log(`Ciudad: ${lugarSel.nombre}`);
               console.log(`Lat: ${lugarSel.lat}`);
               console.log(`Lng: ${lugarSel.lng}`);
               console.log(`Temperatura: ${clima.temp}`);
               console.log(`Mínima: ${clima.temp_min}`);
               console.log(`Máxima: ${clima.temp_max}`);
               console.log(`Descripción: ${clima.descripcion}`);
               break

            case 2: 
               busquedas.leerDb()
               console.log('busqueda'); 
               busquedas.historial.forEach( (lugar_buscado, i) => {
                   const idx = `${i + 1}.`.green
                   console.log(`${idx} ${lugar_buscado}`);
               })

       }

       if (opt !== 0) await pausa()
   }while(opt !== 0)
}

main()