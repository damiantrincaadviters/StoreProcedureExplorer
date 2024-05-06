
import { Console } from 'console';
import * as fs from 'fs';

function openFile() {
    let myLogger = new Console({
        stdout: fs.createWriteStream(`files/sp-analyzer.txt`), // Save normal logs here
        stderr: fs.createWriteStream("files/sp-analyzerErrStd.txt"),    // Save error logs here
    });

    const csvData = fs.readFileSync('C:/Users/DamiánTrinca/Downloads/Analisis DB(SpDefinitionDbClientes).csv', 'utf8').toString();

    // Split the data into lines
    const lines = csvData.split('\n');

    // Initialize an empty array to store the parsed data
    const dataArray = [];
    // Process each line
    for (const line of lines) {
        const values = line.split(';').map((value) => value.trim());
        const name = values.shift();
        dataArray.push({ name, sp: values.join(';') });
    }

    console.log({ dataArray })
    // const regex = /sp(?!\s)/; // Matches 'sp' not followed by a space
    const data = dataArray.filter(data => data.sp.toLowerCase().includes('exec sp') || data.sp.toLowerCase().includes('exec  sp'));
    const filterSp = data.map(p => {
        // const inputString = p.sp;
        // const regex = /exec\s(\S+)/; // Matches 'exec ' followed by non-space characters
        // const match = inputString.match(regex);
        let result = p.sp.toLowerCase().split('exec ').filter(p => p.toLowerCase().includes('sp'))
        // .filter(p => p.toLowerCase().includes('sp'));
        // myLogger.table(result)
        return { name: p.name, result };
        // const desiredSubstring = result[0].trimStart().split(' ')[0]
        // console.log(desiredSubstring)
        // return { sp: p.name, spfound: desiredSubstring ? desiredSubstring : '' };
    })

    let final: { name?: string, sps: string[] }[] = [];

    filterSp.forEach(p => {
        let newResult: string[] = [];

        p.result.forEach(q => {
            if (q.split(' ')[0].includes('sp')) {
                newResult.push(q.split(' ')[0].replaceAll('[', '').replaceAll(']', ''));
            }
        });

        if (newResult.length > 0) {
            final.push({ name: p.name, sps: newResult })
        }
    })

    let stringFinal: string[] = []

    final.forEach(p => {
        p.sps.forEach(q => {
            stringFinal.push(`${q},${p.name}`);
            myLogger.log(`${q},${p.name}`);
        })
    })

    const stringSet = new Set<string>(stringFinal);
    // myLogger.table(stringSet);
}

openFile();


// const inputString = " -- =============================================  -- Author:  Orlando Tovar Valencia  -- Create date: 2019-03-22  -- Description: Consulta el usuario por identificacion y tipo de identificacion  -- =============================================  -- =============================================  -- Author:  Wilson Rene Camacho  -- Create date: 2019-05-23  -- Description: Se agregan tablas para traer la informacion del contratista(Razon social y correo).  -- =============================================  -- =============================================  -- Author:  Wilson Rene Camacho  -- Create date: 2019-05-28  -- Description: En el filtro tipo DIR tambien se agrega filtro tipo CON (WI-5747)  -- =============================================  -- =============================================    -- Author:  Fabian Baicue  -- Modified date: 2019-03-19  -- Description: se agrega campos de la tabla usuario: telefono y bandera (USUAutorizaDatos) de autorización tratamiento de datos.  -- WI: 4963   -- =============================================    -- Author   : Laura Yaneth Moreno Piñeros  -- Create date  : 23/01/2024  -- Description  : Se agregan campo USUHuePlantilla a consulta  -- Aplication  : SiewebLive  -- User Story US : 812  -- ===========================================================================================================================================  -- Author   : Laura Yaneth Moreno Piñeros  -- Create date  : 21/02/2024  -- Description  : Se elimina condicion PUNSERtipo IN ('DIR','CON') del campo EstaEnroladoPunDir  -- Aplication  : SiewebLive  -- User Story US : 1373  -- ===========================================================================================================================================  -- Author   : Cristian Camilo Urrego Rojas  -- Create date  : 22/02/2024  -- Description  : Se configuran los perfiles  ('CANCAJ','CANCAJPRI') en el parametro general,Se agrega el Join a USUARIOGRUPO  -- Aplication  : SiewebLive  -- User Story US : 1425  -- ===========================================================================================================================================  -- Eje: EXEC spUSUSelConsultaCajero '7732170','CC','010671'    CREATE PROCEDURE [dbo].[spUSUSelConsultaCajero]   @identificacion VARCHAR(15),@tipoIdentificacion CHAR(3),@codigoPAP VARCHAR(10)  AS  BEGIN   -- SET NOCOUNT ON added to prevent extra result sets from   -- interfering with SELECT statements.   SET NOCOUNT ON;      DECLARE @PerfilEnrrolamiento VARCHAR(50)   SELECT @PerfilEnrrolamiento = PARGENvalor   FROM PARAMETROS_GENERALES WITH(NOLOCK)    WHERE PARGENdescripcion = 'SiewebLive.POS.PerfilesEnrolamientoEspecialistas'        -- Insert statements for procedure here   SELECT    USUcodigo AS Codigo,USUnombre AS Nombre,USUapellidos AS Apellido,ISNULL(USUbloqueado,0) AS Bloqueado,USUcorreo AS Correo,USUenroladoPor AS EnroladoPor,USUidentificacion AS Identificacion,USUtipoIdentificacion AS TipoIdentificacion,ISNULL(USUConfronta,0) AS Confronta,convert(datetime,CASE WHEN USUConfrontaFecha IS NULL     THEN '01-01-1900 00:00:00'     ELSE USUConfrontaFecha    END,101) AS ConfrontaFecha,ISNULL(USUconfrontaReintentos,0) AS NoReintentos,CASE WHEN @codigoPAP = USUPS     THEN 1     ELSE 0    END AS EstaEnroladoMismoPAP,CASE WHEN (SELECT PUNSERcodigo FROM PUNTOSERVICIO WITH (NOLOCK) WHERE PUNSERcodigo = @codigoPAP AND PUNSERestado = 'ACT') IS NULL     THEN 1     ELSE 0    END AS EstaEnroladoPunDir,CASE WHEN (SELECT PUNSERIdRed FROM RED_CONTRATISTA WITH (NOLOCK) INNER JOIN PUNTOSERVICIO WITH (NOLOCK) ON PUNSERIdRed = REDCONId WHERE PUNSERcodigo = USUPS) =               (SELECT PUNSERIdRed FROM RED_CONTRATISTA WITH (NOLOCK) INNER JOIN PUNTOSERVICIO WITH (NOLOCK) ON PUNSERIdRed = REDCONId WHERE PUNSERcodigo = @codigoPAP)     THEN 1     ELSE 0    END AS EstaEnroladoPunRed,USUPS AS CodigoPAP,CONRazonsocial AS RazonSocialContratista,CONMail as CorreoContratista,USUNumTelefono as Telefono,USUAutorizaDatos as AutorizaDatos,CASE WHEN USUHuePlantilla IS NULL      THEN 0     ELSE 1    END AS EstaEnroladoPOS   FROM    USUARIO WITH(NOLOCK)    INNER JOIN PUNTOSERVICIO WITH(NOLOCK) ON      PUNSERcodigo = USUPS AND PUNSERestado = 'ACT'    INNER JOIN RED_CONTRATISTA WITH(NOLOCK) ON      PUNSERIdRed = REDCONId    INNER JOIN CONTRATISTA WITH(NOLOCK) ON      REDCONTipoIdContratista = CONtipoid and      REDCONIdContratista = CONidentificacion AND CONEstado = 'ACT'    INNER JOIN USUARIOGRUPO WITH(NOLOCK) ON      USUGRUusuario = USUcodigo AND      USUGRUgrupo IN (SELECT VALUE FROM STRING_SPLIT(@PerfilEnrrolamiento,','))   WHERE    USUtipoIdentificacion = @tipoIdentificacion AND    USUidentificacion = @identificacion AND     USUestado = 'ACT'    END";

// let result = inputString.toLowerCase().split('exec').filter(p => p.toLowerCase().includes('sp'));
// // console.log(result);
// const desiredSubstring = result[0].trimStart().split(' ')[0]
// console.log(desiredSubstring);

// const inputString = 'exec  spCONREDPSSelConfiguracionRedPS CREATE...';
// const regex = /exec\s(\S+)/; // Matches 'exec ' followed by non-space characters
// const match = inputString.match(regex);
// const desiredSubstring = match ? match[1] : ''; // Extract the captured group
// console.log(desiredSubstring);


// const myString = '/*Se modifica spp';
// const regex = /sp(?!\s)/; // Matches 'sp' not followed by a space
// const containsSP = regex.test(myString);
// console.log(containsSP);