import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";

const getExpensesData = async () => {
  const response = await fetch("http://localhost:3000/expenses");
  return await response.json();
};

//  {
//     "id": 2002507338,
//     "group_id": null,
//     "friendship_id": null,
//     "expense_bundle_id": null,
//     "description": "I owe shreyas",
//     "repeats": false,
//     "repeat_interval": null,
//     "email_reminder": false,
//     "email_reminder_in_advance": -1,
//     "next_repeat": null,
//     "details": "",
//     "comments_count": 0,
//     "payment": false,
//     "creation_method": "split",
//     "transaction_method": "offline",
//     "transaction_confirmed": false,
//     "transaction_id": null,
//     "transaction_status": null,
//     "cost": "150.0",
//     "currency_code": "INR",
//     "repayments": [
//       {
//         "from": 60131117,
//         "to": 60131137,
//         "amount": "150.0"
//       }
//     ],
//     "date": "2022-11-05T06:51:37Z",
//     "created_at": "2022-11-05T06:51:39Z",
//     "created_by": {
//       "id": 60131117,
//       "first_name": "Chetan",
//       "last_name": "P Hattoor",
//       "picture": {
//         "medium": "https://s3.amazonaws.com/splitwise/uploads/user/default_avatars/avatar-ruby23-100px.png"
//       },
//       "custom_picture": false
//     },
//     "updated_at": "2022-11-05T06:51:39Z",
//     "updated_by": null,
//     "deleted_at": null,
//     "deleted_by": null,
//     "category": {
//       "id": 18,
//       "name": "General"
//     },
//     "receipt": {
//       "large": null,
//       "original": null
//     },
//     "users": [
//       {
//         "user": {
//           "id": 60131137,
//           "first_name": "Shreyas",
//           "last_name": "Prabhu Pes Mca Otian",
//           "picture": {
//             "medium": "https://s3.amazonaws.com/splitwise/uploads/user/default_avatars/avatar-grey43-100px.png"
//           }
//         },
//         "user_id": 60131137,
//         "paid_share": "150.0",
//         "owed_share": "0.0",
//         "net_balance": "150.0"
//       },
//       {
//         "user": {
//           "id": 60131117,
//           "first_name": "Chetan",
//           "last_name": "P Hattoor",
//           "picture": {
//             "medium": "https://s3.amazonaws.com/splitwise/uploads/user/default_avatars/avatar-ruby23-100px.png"
//           }
//         },
//         "user_id": 60131117,
//         "paid_share": "0.0",
//         "owed_share": "150.0",
//         "net_balance": "-150.0"
//       }
//     ]
//   }

const Expenses = () => {
  const [response, setExpenses] = useState([]);

  useEffect(() => {
    let mounted = true;
    getExpensesData().then((items) => {
      if (mounted) {
        setExpenses(items);
      }
    });
    return () => (mounted = false);
  }, []);

  return (
    <>
      <h1>Expenses</h1>
      <br/>
        {response.expenses &&
          response.expenses.map((expense) => (
            <div key={expense.id} className="expense">
              <p>Id: {expense.id}</p>
              <p>Created By: {expense.created_by.first_name} </p>
              <p>Description: {expense.description} </p>
              <p>
                Total Cost: {expense.currency_code}{" "}{expense.cost}
              </p>
              <div >
                Repayments:{expense.repayments.length && expense.repayments.map(
                  (repayment, i) => (
                    <>
                    <div key={i} className="repayments">
                        <p>You owe {repayment.to} Amount: {expense.currency_code+" "}{repayment.amount}</p>
                    </div>
                    <QRCode key={i+1} value={getQr(repayment.upi,repayment.amount,response.user.first_name)} />
                    </>
                  )
                )}
              </div>
            </div>
          ))}
    </>
  );
};

const getQr = async (upi,amount,payeeName) => {
    if(upi!==null){
        return "upi://pay?pa="+upi+"&pn="+payeeName+"&am="+amount+"&tn=write a note"
    }else{
        //form to get upi
        return "upi://pay?pa=payee-vpa&pn=payee-name&am=amount&tn=write a note"

    }
}

export default Expenses;
