exports.pubsubconfig = {
    topic: {
        inbox: {
            name: "monpay-in",
            subscription: "monpay-in-sub"
        },
        outbox: {
            name: "monpay-out",
            subscription: "monpay-out-sub"
        }
    }
}