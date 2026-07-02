// module.exports = createSocketBroadcaster;
function createSocketBroadcaster(io) {
    return (req, res, next) => {
        const broadcastMethods = ['POST', 'PUT', 'DELETE'];

        if (!broadcastMethods.includes(req.method)) {
            return next();
        }

        const originalSend = res.send;

        res.send = function (body) {
            try {
                const parsed = typeof body === 'string' ? JSON.parse(body) : body;

                // Global condition
                if (parsed?.success === true && parsed.data) {
                    // const segments = req.originalUrl.split('?')[0].split('/');
                    // let routeKey = segments[2] || '';

                    // // Skip broadcasting if route is bomfilter
                    // if (routeKey === 'bomfilter') {
                    //     return originalSend.apply(res, arguments);
                    // }

                    // // Special cases for /api/data-sheet/* and /api/file/*
                    // if (routeKey === 'data-sheet' || routeKey === 'file') {
                    //     routeKey = segments[3] || '';
                    //     // Skip broadcasting if segment[3] is "sellect"
                    //     if (segments[3] === 'sellect') {
                    //         return originalSend.apply(res, arguments);
                    //     }
                    // }

                    const method = req.method.toLowerCase();

                    // ✅ Fix: determine the correct data before emitting
                    // const broadcastData = method === 'post'
                    //     ? parsed.data[0]   // only first item if POST returns an array
                    //     : parsed.data;

                    io.emit('api_broadcast', {
                        type: method,
                        route: routeKey,
                        data: parsed.data,
                        userEmail : req.user.email,
                        time: new Date,
                    });

                    // console.log(`[Broadcast] ${method.toUpperCase()} /${routeKey}`, parsed.data);
                }
            } catch (err) {
                console.warn('[Broadcast Warning] Failed to parse response body:', err);
            }

            return originalSend.apply(res, arguments);
        };
        next();
    };
}

module.exports = createSocketBroadcaster;