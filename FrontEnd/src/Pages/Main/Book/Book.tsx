import { Fragment, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

function Book() {
  const [group, setGroup] = useState<boolean>(false);
  const [hotel, setHotel] = useState<boolean>(false);
  const [membersAmount, setMembersAmount] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    if (hotel) {
      setTotalPrice(500 * membersAmount + 100);
    } else {
      setTotalPrice(500 * membersAmount);
    }
  }, [hotel, membersAmount]);

  useEffect(() => {
    if (group === false) {
      setMembersAmount(1);
    }
  }, [group]);

  const validatePersonsInput = (persons: number) => {
    // Convert input to a number
    if (persons < 2 || persons > 10) {
      return "Person should be between 1-10";
    }
    return persons;
  };
  return (
    <Fragment>
      <Helmet>
        <title>Book</title>
        <meta
          name="description"
          content="On this page you can purchase tickets"
        />
        <link rel="canonical" href="/Book" />
      </Helmet>
      <section className=" bg-white dark:bg-black pt-[17.25rem] shadow-whole-white dark:shadow-whole-black">
        <div className="flex flex-col w-full h-full px-4 py-20 min-600:p-12 min-900:p-20 min-1000:flex-row items-start gap-32 shadow-whole-white-Book  dark:shadow-whole-black-Book bg-[#00e1ff3a] dark:bg-[#00e1ff0f] ">
          <div className="flex flex-col w-full gap-9 text-black dark:text-white">
            <p className="text-res-special-galerry-title text-blue-800 dark:text-[#ffbc69] py-2 border-b-4 border-[#ffbc69] dark:border-blue-950">
              Order
            </p>
            <div>
              <div className="flex flex-col  gap-4  ">
                <p className="text-res-md text-blue-700 dark:text-[#ffbc69]">
                  Tour:
                </p>
                <div className="flex   gap-4 [&>div]:flex [&>div]:gap-2">
                  <label className="flex items-center relative align-middle	pl-10 text-res-md-sm   [&>input:checked~span:after]:-translate-x-2/4 [&>input:checked~span:after]:-translate-y-2/4 [&>input:checked~span:after]:scale-100">
                    <input
                      type="radio"
                      onChange={() => {
                        setGroup(false);
                      }}
                      defaultChecked
                      name="Tour"
                      value="one person"
                      className="[display:none]"
                    />
                    <span
                      className="absolute block left-0 cursor-pointer h-4 w-4 border-2 border-[#e89c3e] dark:border-blue-700 rounded-[50%] 
                  after:[content:''] after:block after:absolute after:top-2/4 after:left-2/4 after:-translate-x-1/2 after:-translate-y-1/2 
                  after:scale-0 after:transition-all after:ease-in-out after:duration-300 after:rounded-[50%] after:h-2 after:w-2
                  after:bg-[#e89c3e] after:dark:bg-blue-700 "
                    />
                    One Person
                  </label>
                  <label className="flex items-center relative align-middle	pl-10 text-res-md-sm   [&>input:checked~span:after]:-translate-x-2/4 [&>input:checked~span:after]:-translate-y-2/4 [&>input:checked~span:after]:scale-100">
                    <input
                      type="radio"
                      onChange={() => {
                        setGroup(true);
                      }}
                      name="Tour"
                      value="group"
                      className="[display:none]"
                    />
                    <span
                      className="absolute block left-0 cursor-pointer h-4 w-4 border-2 border-[#e89c3e] dark:border-blue-700 rounded-[50%] 
                  after:[content:''] after:block after:absolute after:top-2/4 after:left-2/4 after:-translate-x-1/2 after:-translate-y-1/2 
                  after:scale-0 after:transition-all after:ease-in-out after:duration-300 after:rounded-[50%] after:h-2 after:w-2
                  after:bg-[#e89c3e] after:dark:bg-blue-700"
                    />
                    Group
                  </label>
                </div>
              </div>
            </div>
            <div>
              <p className="text-res-md text-blue-700 dark:text-[#ffbc69]">
                Date
              </p>
              <p className="text-res-md-sm">From: 22 / 05 / 2024</p>
              <p className="text-res-md-sm">To: 22 / 05 / 2024</p>
            </div>
            <div>
              <p className="text-res-md text-blue-700 dark:text-[#ffbc69]">
                Hotel
              </p>

              <form
                className="flex text-res-md-sm
                [&>input+label]:flex [&>input+label]:gap-2 [&>input+label]:items-center [&>input+label:before]:[content:'\2713'] [&>input+label:before]:cursor-pointer [&>input+label:before]:px-1 [&>input+label:before]:!text-res-special-checkbox [&>input+label:before]:!font-semibold
                 [&>input+label:before]:w-fit [&>input+label:before]:h-fit 
                [&>input+label:before]:border   [&>input+label:before]:border-[#ffbc69]  [&>input+label:before]:rounded 
                [&>input+label:before]:inline-block   [&>input+label:before]:align-middle  [&>input+label:before]:text-transparent
              [&>input:checked+label:before]:text-black  [&>input:checked+label:before]:bg-white dark:[&>input:checked+label:before]:text-white dark:[&>input:checked+label:before]:bg-black  
          "
              >
                <input
                  type="checkbox"
                  id="hotel"
                  onChange={() => {
                    setHotel(!hotel);
                  }}
                  checked={hotel ? true : false}
                  className="[display:none]"
                />
                <label htmlFor="hotel">100 Gel</label>
              </form>
            </div>
            <div>
              <p className="text-res-md text-blue-700 dark:text-[#ffbc69]">
                Person
              </p>
              {!group ? (
                <p className="text-res-md-sm">1</p>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={2}
                    max={10}
                    value={membersAmount || ""} // Bind the input to the state
                    className="px-3 py-2 rounded-lg bg-transparent border-2 border-[#ffbc69] dark:border-blue-950 outline-none !text-black dark:!text-white"
                    onChange={async (e) => {
                      // Parse the number from the input
                      const numberValue = e.target.valueAsNumber;

                      // Validate the input
                      const validationMessage =
                        validatePersonsInput(numberValue);
                      if (typeof validationMessage === "string") {
                        const { toast } = await import("react-toastify");

                        toast.error(validationMessage); // Show validation error
                        setMembersAmount(numberValue);
                      } else {
                        setMembersAmount(numberValue); // Update state if valid
                      }
                    }}
                  />
                </div>
              )}
            </div>
            <div>
              <p className="text-res-md text-blue-700 dark:text-[#ffbc69]">
                Total:
              </p>
              <span className="grid gap-2 text-res-md-sm text-black dark:text-white">
                {Number.isNaN(membersAmount) ? (
                  <span className="text-res-md-sm ">0.00 Gel</span>
                ) : (
                  <span className="text-res-md-sm ">{totalPrice} Gel</span>
                )}
              </span>
            </div>
          </div>
          <div className=" flex flex-col w-full h-full gap-9  text-black dark:text-white ">
            <p className="text-res-special-galerry-title text-blue-800 dark:text-[#e89c3e] py-2 border-b-4 border-[#ffbc69] dark:border-blue-950">
              Payment
            </p>
            <div className="grid gap-2">
              <p className="text-res-md text-blue-700 dark:text-[#ffbc69]">
                Pay With
              </p>
              <div className="flex flex-wrap gap-4  [&>div]:flex [&>div]:gap-2">
                <label
                  className="flex  text-center items-center relative align-middle	pl-10 text-res-md-sm [&>input:checked~span:after]:-translate-x-2/4 [&>input:checked~span:after]:-translate-y-2/4 
                 [&>input:checked~span:after]:scale-100
              "
                >
                  <input
                    type="radio"
                    name="PayWith"
                    value="card"
                    defaultChecked
                    className="[display:none]"
                  />
                  <span
                    className="absolute block left-0  h-4 w-4 border-2 border-[#e89c3e] dark:border-blue-700 rounded-[50%] cursor-pointer
                after:[content:'']  after:block after:absolute after:top-2/4 after:left-2/4 after:-translate-x-1/2 after:-translate-y-1/2 
                after:scale-0 after:transition-all after:ease-in-out after:duration-300 after:rounded-[50%] after:h-2 after:w-2
                after:bg-[#e89c3e] after:dark:bg-blue-700"
                  />
                  Card
                </label>
                <label className="flex items-center relative align-middle	pl-10 text-res-md-sm  [&>input:checked~span:after]:-translate-x-2/4 [&>input:checked~span:after]:-translate-y-2/4 [&>input:checked~span:after]:scale-100">
                  <input
                    type="radio"
                    name="PayWith"
                    value="bank"
                    className="[display:none]"
                  />
                  <span
                    className="absolute block left-0  h-4 w-4 border-2 border-[#e89c3e] dark:border-blue-700 rounded-[50%] cursor-pointer
                  after:[content:''] after:block after:absolute after:top-2/4 after:left-2/4 after:-translate-x-1/2 after:-translate-y-1/2 
                  after:scale-0 after:transition-all after:ease-in-out after:duration-300 after:rounded-[50%] after:h-2 after:w-2
                  after:bg-[#e89c3e] after:dark:bg-blue-700"
                  />
                  Bank
                </label>
                <label className="flex items-center relative align-middle	pl-10 text-res-md-sm   [&>input:checked~span:after]:-translate-x-2/4 [&>input:checked~span:after]:-translate-y-2/4 [&>input:checked~span:after]:scale-100">
                  <input
                    type="radio"
                    name="PayWith"
                    value="transfer"
                    className="[display:none]"
                  />
                  <span
                    className="absolute block left-0  h-4 w-4 border-2 border-[#e89c3e] dark:border-blue-700 rounded-[50%] cursor-pointer
                  after:[content:''] after:block after:absolute after:top-2/4 after:left-2/4 after:-translate-x-1/2 after:-translate-y-1/2 
                  after:scale-0 after:transition-all after:ease-in-out after:duration-300 after:rounded-[50%] after:h-2 after:w-2
                  after:bg-[#e89c3e] after:dark:bg-blue-700"
                  />
                  Transfer
                </label>
              </div>
            </div>
            <div className="flex flex-col gap-2 [&>input]:min-300:w-3/4">
              <p className="text-res-md text-blue-700 dark:text-[#ffbc69]">
                Card Number
              </p>
              <input
                type="number"
                className="px-3 py-2 rounded-lg  bg-transparent border-2 border-[#ffbc69] dark:border-blue-950 outline-none !text-black dark:!text-white"
              />
            </div>
            <div className="flex flex-col w-full justify-between gap-4 [&>div>input]:min-300:w-3/4  ">
              <div className="grid  w-full gap-2">
                <p className="text-res-md text-blue-700 dark:text-[#ffbc69] ">
                  Expiration Date
                </p>
                <input
                  type="date "
                  className="px-3 py-2  rounded-lg bg-transparent  border-2 border-[#ffbc69] dark:border-blue-950 outline-none !text-black dark:!text-white"
                />
              </div>
              <div className="grid w-full gap-2">
                <p className="text-res-md text-blue-700 dark:text-[#ffbc69]">
                  CVC
                </p>
                <input
                  type="number"
                  className="px-3 py-2 rounded-lg  bg-transparent border-2 border-[#ffbc69] dark:border-blue-950 outline-none !text-black dark:!text-white"
                />
              </div>
            </div>
            <form
              className="flex gap-3 text-res-md-sm textb 
             [&>input+label]:flex [&>input+label]:gap-2 [&>input+label]:items-center [&>input+label:before]:[content:'\2713'] [&>input+label:before]:cursor-pointer [&>input+label:before]:px-1 [&>input+label:before]:!text-res-special-checkbox [&>input+label:before]:!font-semibold
             [&>input+label:before]:w-fit [&>input+label:before]:h-fit [&>input+label:before]:border  [&>input+label:before]:border-[#ffbc69]  [&>input+label:before]:rounded 
             [&>input+label:before]:inline-block  [&>input+label:before]:align-middle  [&>input+label:before]:text-transparent
             [&>input:checked+label:before]:text-black  [&>input:checked+label:before]:bg-white dark:[&>input:checked+label:before]:text-white dark:[&>input:checked+label:before]:bg-black  
              "
            >
              <input type="checkbox" id="save" className="[display:none] " />
              <label htmlFor="save">Save card details</label>
            </form>
            <button className=" w-3/4   self-center  mt-5 bg-[#ffbc69] dark:bg-blue-800  py-5 rounded-lg text-res-base text-blue-800 dark:text-[#ffbc69]">
              <p>Pay</p>
            </button>
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export default Book;
