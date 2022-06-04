// validator function (object) =================================================================
function Validator(options) {

    var selectorRules = {}
    //hàm thực hiện validate 
    function Validate (inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage = rule.test(inputElement.value); // error message in console
        // console.log(errorMessage)

        // lấy ra các rule của selector
        var rules = selectorRules[rule.selector];

        //lặp qua từng rule và kiểm tra
        for (var i = 0; i < rules.length; ++i) {
           errorMessage =  rules[i](inputElement.value);
           if(errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage; // inner text lỗi từ error message vào trong thẻ span có class là .form-message     
            inputElement.parentElement.classList.add('invalid');
        }else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        }
        return !errorMessage;
    }

    var formElement = document.querySelector(options.form)  // get form element ( '#form-1')
    if (formElement) {
        // khi submit form
         formElement.onsubmit = function(e) {
             e.preventDefault();
            
             var isFormValid = true;

             //thực hiện lặp qua từng rule và validate input
             options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);                 
                var isValid =  Validate(inputElement,rule) ;
                if (!isValid) {
                    isFormValid = false;
                }  
             });
             if (isFormValid) {

                // submit với javascript
                 if(typeof options.onsubmit === 'function'){
                    var enableInputs = formElement.querySelectorAll('[name]');
                    var formValues = Array.from(enableInputs).reduce(function(values, input,){
                        return (values[input.name] = input.value) && values;
                    },{});
                    options.onsubmit (formValues)
                 }else { // trường hợp submit với hành vi mặt định
                    formElement.submit();   
                 }
             }
         }   

        //lặp qua mỗi rule và xử lý (lắng nghe sự kiện)
        options.rules.forEach(function (rule) {

            // lưu lại các rule cho mỗi input   
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test)
            }else{
                selectorRules[rule.selector] = [rule.test];
            }
         
            var inputElement = formElement.querySelector(rule.selector)

            if (inputElement) {
                // listen event on blur input element 
                inputElement.onblur = function () {
                    // get value from input element
                    // inputElement.value ?? 
                    // test 9function : rule.test         
                    Validate(inputElement,rule);        
                }

                // xử lý mỗi khi người dùng nhập vào input
                inputElement.oninput = function () {
                    var errorMessage = rule.test(inputElement.value); // error message in console
                    // console.log(errorMessage)
                    var errorElement = inputElement.parentElement.querySelector('.form-message');

                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid')
                }
            }

        });

    }
}

//function isRequired in validator function =================================================
Validator.isRequired = function (selector,message) {
    // need to return 
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined :message || 'Vui lòng nhập trường này'
        }
    }
}
// function isEmail in validator function =================================================
Validator.isEmail = function (selector,message) {
    //need to return
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
            return regex.test(value) ? undefined : message ||'Trường này phải là email'
        }
    }
}

Validator.minLength = function (selector,min,message) {
    //need to return
    return {
        selector: selector,
        test: function (value) {    
           return value.length >= min ? undefined :message || `Vui Lòng Nhập Tối Thiểu ${min} Kí Tự`
        }
    }
}
//isConfirmPassword

Validator.isConfirm = function (selector,getConfimValue,message) {
    //need to return
    return {
        selector: selector,
        test: function (value) {    
           return value == getConfimValue() ? undefined : message || 'Gía trị nhập vào không chính xác'
        }
    }
}