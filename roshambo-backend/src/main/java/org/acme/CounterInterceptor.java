package org.acme;

import jakarta.annotation.Priority;
import jakarta.inject.Inject;
import jakarta.interceptor.AroundInvoke;
import jakarta.interceptor.Interceptor;
import jakarta.interceptor.InvocationContext;

import java.util.concurrent.atomic.AtomicInteger;

import org.jboss.logging.Logger;

@Interceptor
@Priority(Interceptor.Priority.APPLICATION + 1)
@Counted
public class CounterInterceptor {
    @Inject
    Logger logger;

    private static AtomicInteger counter = new AtomicInteger(0);

    @AroundInvoke
    public Object intercept(InvocationContext context) throws Exception {
        logger.infof("concurrent shape detections increased to %d", counter.incrementAndGet());

        try {
            return context.proceed();
        } finally {
            logger.infof("concurrent shape detections decreased to %d", counter.decrementAndGet());
        }
    }

    public static int getCounter() {
        return counter.get();
    }
}
