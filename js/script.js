$('#compile').on('click', function () {
    localStorage.clear();

    let $regex = /^([A-z]|[0-9])(\sEntero|\sTexto|\sReal);$/;
    let $regex2 = /^([A-z]|[0-9])*(\s=|\=|\s=\s)Captura\.[A-z]*\(\);$/;
    let $regexFinal = /^Mensaje\.(Texto\(\"([0-9]|[A-z]|([ñ+$&%-_,.;"']))*\"\)|Entero\([0-9]*((\+|-|x|X|)[0-9])+\)|Real\([0-9]+([,][0-9]+)(E|E[0-9]*)?((\+|-|x|X|)([0-9]+([,][0-9]+)(E|E[0-9]*)?))*\));$/;

    let $token = $('#token').val();
    let $arrayToken = [];
    let $arrayDeclare = [];

    if ($token) {
        if (!$token.includes(';')) {
            return alert("Falta Punto y Coma (;), Linea 1")
        } else {

            //LINE 1
            $arrayDeclare = $token.split(' ');
            $declare = $arrayDeclare['0'];
            $declareDat = $arrayDeclare['1'].split(';')[0];

            $oneLine = $token.split(';')[0];

            validateCode(validateRegex($regex, $oneLine + ";"), 1);

            $arrayToken = $token.split('=');
            $arrayToken2 = $token.split(';') ? $token.split(';') : false;
            //END LINE 1

            //LINE 2
            if ($arrayToken2.length > 2) {
                $seconLine = $arrayToken2['1'];
                $seconLineVALID = $seconLine.split(" ")[0];
                if ($seconLineVALID.trim() === $declare) {
                    $secondLineDatPre = $arrayToken['1'].replace(' ', '').split('.')['1'].replace('();', ';');
                    $secondLineDat = $secondLineDatPre.split(';')['0'].trim();
                    if ($declareDat != $secondLineDat) {
                        alert("El Tipo de dato no es el mismo, Linea 2");
                    } else {
                        validateCode(validateRegex($regex2, $seconLine.trim() + ";"), 2);
                    }
                } else {
                    return alert("La Variable " + $seconLineVALID + " No esta declarada, Linea 2.");
                }
            }
            //END LINE 2

            //LINE 3
            if ($arrayToken2.length > 2) {
                $treeLine = $token.split(';')[2].replace(' ', '') + ";";
                if ($treeLine.includes("=")) {
                    $tokenNOW = $token.split(';');
                    if ($arrayToken2[2] != "") {
                        $tokenNOW2 = $tokenNOW[2].trim();
                        if (!$treeLine.includes(";")) {
                            return alert("Falta Punto y Coma (;)");
                        } else {

                            if ($treeLine.includes("=")) {
                                $treeLineVAR = $treeLine.split('=')[0].replace(' ', '');
                                $treeLineVAlUE = $treeLine.split('=')[1].replace(' ', '').replace(';', '');
                                $flag = false;

                                if (!$treeLine.includes(';')) {
                                    return alert("Error Linea 3, Falta Punto y Coma (;)");
                                } else {
                                    if ($treeLineVAR.trim() === $declare) {
                                        switch ($declareDat) {
                                            case "Entero":
                                                let $regexENTERO = /^[0-9]*((\+|-|x|X|)[0-9])+$/;
                                                $treeLineVAlUETRIM = $treeLineVAlUE.replace(/\s/g, '');
                                                if (validateRegex($regexENTERO, $treeLineVAlUETRIM)) {
                                                    $flag = true;
                                                } else {
                                                    return alert("El Valor Asignado No Coincide Con el Tipo de dato " + $declareDat)
                                                }
                                                break;
                                            case "Real":
                                                let $regexREAL = /^[0-9]+([,][0-9]+)(E|E[0-9]*)?((\+|-|x|X|)([0-9]+([,][0-9]+)(E|E[0-9]*)?))*$/;
                                                if (validateRegex($regexREAL, $treeLineVAlUE)) {
                                                    $flag = true;
                                                } else {
                                                    return alert("El Valor Asignado No Coincide Con el Tipo de dato " + $declareDat)
                                                }
                                                break;
                                            case "Texto":
                                                let $regexTEXTO = /^([0-9]|[A-z]|([ñ+$&%-_,.;"']))*$/;
                                                if (validateRegex($regexTEXTO, $treeLineVAlUE)) {
                                                    $flag = true;
                                                } else {
                                                    return alert("El Valor Asignado No Coincide Con el Tipo de dato " + $declareDat)
                                                }
                                                break;
                                        }

                                        if ($flag) {
                                            alert("Codigo Valido, Linea 3");
                                        }

                                    } else {
                                        return alert("La variable " + $treeLineVAR.trim() + " No Esta declarada, Linea 3")
                                    }
                                }
                            }
                        }
                    }
                } else {
                    return alert("Falta Signo Igual (=), Linea 3");
                }
            }
            //END LINE 3

            //LINE 4
            if ($arrayToken2.length > 3) {
                $fourLine = $token.split(';')[3].replace(' ', '').trim() + ";";
                $ultimaLinea = $arrayToken[2].split(')');
                if ($ultimaLinea.length > 0) {
                    if (!$ultimaLinea[1].includes(';')) {
                        return alert("Falta Punto y Coma (;), Linea 4");
                    }
                }
                validateCode(validateRegex($regexFinal, $fourLine), 4);
            }
            //END LINE 4
        }
    } else {
        alert("Debe Digitar Su Codigo");
    }
});


function validateRegex($regex, $val) {
    let res = new RegExp($regex).test($val.trim());
    return res;
}

function validateCode($res, $line) {
    if ($res) {
        alert("Codigo Valido, Linea " + $line);
    } else {
        return alert("Codigo No Valido, En la linea " + $line);
    }
}