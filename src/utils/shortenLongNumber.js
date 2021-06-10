function getShortenNumber(rep){
    let repString;
    const stringNumber = rep.toString()
    if( typeof stringNumber === 'string' ) {
         if (stringNumber < 1000){
            repString = stringNumber;
        }
        else if (rep < 10000){
            repString = stringNumber.charAt(0) + ',' + stringNumber.substring(1);
        }
        else{
            repString = (Math.round((stringNumber / 1000) * 10) / 10) + "k"
        }

        return repString.toString();
    }else{
        return 0
    }
}

export default getShortenNumber