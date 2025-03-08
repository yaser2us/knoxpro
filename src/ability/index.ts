import {
    AbilityBuilder,
    createMongoAbility,
    PureAbility
} from '@casl/ability'

export function defineAbilityFor(user) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
    
    if (user.isAdmin === true) {
        can('manage', 'all'); // read-write access to everything
    } else {
        can('read', 'invoice') // read-only access to everything
    }

    cannot('delete', 'Post', { published: true });

    return build();
}

export const myAbility = createMongoAbility([
    {
        action: 'read',
        subject: 'invoice'
    },
    {
        action: 'create',
        subject: 'category'
    },
    {
        action: 'create',
        subject: 'donation'
    },
    {
        action: 'create',
        subject: 'subscription'
    },
    {
        action: 'create',
        subject: 'invoice'
    },
    {
        action: 'read',
        subject: 'contacts'
    },
    {
        action: 'read',
        subject: 'category'
    },
    {
        inverted: true,
        action: 'delete',
        subject: 'Post',
        conditions: { published: true }
    }
])