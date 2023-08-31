package org.acme;

import jakarta.annotation.Priority;
import jakarta.inject.Inject;
import jakarta.interceptor.AroundInvoke;
import jakarta.interceptor.Interceptor;
import jakarta.interceptor.InvocationContext;
import org.jboss.logging.Logger;

@Interceptor
@Priority(Interceptor.Priority.APPLICATION + 1)
@Counted
public class CounterInterceptor {
    @Inject
    Logger logger;

    private static int counter = 0;

    @AroundInvoke
    public Object intercept(InvocationContext context) throws Exception {
        counter++;
        logger.infof("concurrent shape detections increased to %d", counter);

        try {
            return context.proceed();
        } finally {
            counter--;
            logger.infof("concurrent shape detections decreased to %d", counter);
        }
    }

    public static int getCounter() {
        return counter;
    }
}
