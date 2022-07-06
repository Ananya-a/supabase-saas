import initStripe from "stripe";
import { useUser } from "../context/user";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

const Pricing = ({ plans }) => {
  const { user, login, isLoading } = useUser();

  const processSubscription = (planId) => async () => {
    const { data } = await axios.get(`/api/subscription/${planId}`);
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
    await stripe.redirectToCheckout({ sessionId: data.id });
  };

  const showSubscribeButton = !!user && !user.is_subscribed;
  const showCreateAccountButton = !user;
  const showManageSubscriptionButton = !!user && user.is_subscribed;

  return (
    <div className="w-full max-w-3xl mx-auto py-16 flex justify-around">
      {plans.map((plan) => (
        <div key={plan.id} className="w-80 h-40 rounded shadow px-6 py-4">
          <h2 className="text-xl">{plan.name}</h2>
          <p className="text-gray-500">
            ${plan.price / 100} / {plan.interval}
          </p>
          {!isLoading && (
            <div>
              {showSubscribeButton && (
                <button onClick={processSubscription(plan.id)}>
                  Subscribe
                </button>
              )}
              {showCreateAccountButton && (
                <button onClick={login}>Create Account</button>
              )}
              {showManageSubscriptionButton && (
                <button>Manage Subscription</button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export const getStaticProps = async () => {
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

  const { data: prices } = await stripe.prices.list();

  const plans = await Promise.all(
    prices.map(async (price) => {
      const product = await stripe.products.retrieve(price.product);
      return {
        id: price.id,
        name: product.name,
        price: price.unit_amount,
        interval: price.recurring.interval,
        currency: price.currency,
      };
    })
  );

  const sortedPlans = plans.sort((a, b) => a.price - b.price);

  return {
    props: {
      plans: sortedPlans,
    },
  };
};

export default Pricing;

// // import axios from "axios";
// // import { useEffect, useState } from "react";
// // import initStripe from "stripe";
// // // import useUser from "../context/user";
// // import { supabase } from "../utils/supabase";

// // const Pricing = ({ plans }) => {
// //   // const { user, login } = useUser();
// //   const [user, setUser] = useState(supabase.auth.user());
// //   // const [isLoading, setIsLoading] = useState(true);

// //   useEffect(() => {
// //     const getUserProfile = async () => {
// //       const sessionUser = supabase.auth.user();

// //       if (sessionUser) {
// //         const { data: profile } = await supabase
// //           .from("profile")
// //           .select("*")
// //           .eq("id", sessionUser.id)
// //           .single();

// //         setUser({
// //           ...sessionUser,
// //           ...profile,
// //         });

// //         // setIsLoading(false);
// //       }
// //     };

// //     getUserProfile();
// //     supabase.auth.onAuthStateChange(() => {
// //       getUserProfile();
// //     });
// //   }, []);

// //   useEffect(() => {
// //     axios.post("/api/set-supabase-cookie", {
// //       event: user ? "SIGNED_IN" : "SIGNED_OUT",
// //       session: supabase.auth.session(),
// //     });
// //   }, [user]);

// //   const login = async () => {
// //     await supabase.auth.signIn({
// //       provider: "github",
// //     });
// //   };

// //   const processSubscription = (planId) => async () => {
// //     const { data } = await axios.get(`/api/subscription/${planId}`);
// //     console.log(data);
// //   };

// //   const showSubscriptionButton = !!user && !user.is_subscribed;
// //   const showCreateAccountButton = !user;
// //   const showManageSubscriptionButton = !!user && user.is_subscribed;

// //   return (
// //     <div className="w-full max-w-3xl mx-auto py-16 flex justify-around">
// //       {plans.map((plan) => (
// //         <div key={plan.id} className="w-80 h-40 rounded shadow px-6 py-4">
// //           <h2 className="text-xl">{plan.name}</h2>
// //           <p className="text-gray-500">
// //             ${plan.price / 100} / {plan.interval}
// //           </p>
// //           {/* {!isLoading && (
// //             <div> */}
// //           {showSubscriptionButton && (
// //             <button onClick={processSubscription(plan.id)}>Subscribe</button>
// //           )}
// //           {showCreateAccountButton && (
// //             <button onClick={login}>Create Account</button>
// //           )}
// //           {showManageSubscriptionButton && <button>Manage Subscription</button>}
// //           {/* </div>
// //           )} */}
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // export const getStaticProps = async () => {
// //   const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

// //   const { data: prices } = await stripe.prices.list();

// //   const plans = await Promise.all(
// //     prices.map(async (price) => {
// //       const product = await stripe.products.retrieve(price.product);
// //       return {
// //         id: price.id,
// //         name: product.name,
// //         price: price.unit_amount,
// //         interval: price.recurring.interval,
// //         currency: price.currency,
// //       };
// //     })
// //   );

// //   const sortedPlans = plans.sort((a, b) => a.price - b.price);

// //   return {
// //     props: {
// //       plans: sortedPlans,
// //     },
// //   };
// // };

// // export default Pricing;
